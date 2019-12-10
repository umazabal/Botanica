odoo.define('calendar_filters.calendar_controller', function (require) {
	"use strict";


	var AbstractController = require('web.AbstractController');
	var QuickCreate = require('web.CalendarQuickCreate');
	var dialogs = require('web.view_dialogs');
	var Dialog = require('web.Dialog');
	var core = require('web.core');
	var CalendarController = require('web.CalendarController');

	var _t = core._t;
	var QWeb = core.qweb;
	var current_scale = '';

	CalendarController.include({

		init: function (parent, model, renderer, params) {
			this._super.apply(this, arguments);
		},
		renderButtons: function ($node) {
			var self = this;
			this.$buttons = $(QWeb.render("CalendarView.buttons", {'widget': this}));
			this.$buttons.on('click', 'button.o_calendar_button_new', function () {
				self.trigger_up('switch_view', {view_type: 'form'});
			});
			var year1 = (new Date).getFullYear();
			var Event = function(text, className,ids) {
				this.text = text;
				this.className = className;
				this.ids = ids;
			};
			var events = {};
			var date_start = false;
			var date_stop = false;
			var fields = ['name','color'];
			var context = {};
			if (self.mapping.date_start) {
				date_start = self.mapping.date_start;
				fields.push(date_start);
			}
			if (self.mapping.date_stop) {
				date_stop = self.mapping.date_stop;
				fields.push(date_stop);
			}

			const format_date = (date) =>{
				var year = date.getFullYear(),
				month = ("0" + (date.getMonth() + 1)).slice(-2),
				day = ("0" + (date.getDate())).slice(-2);
				var ff = year + '-' + month + '-' + day;
				return ff;
			};

			const getDatesBetween = (startDate, endDate) => {
				const dates = [];
				// Strip hours minutes seconds etc.
				let currentDate = new Date(
					startDate.getFullYear(),
					startDate.getMonth(),
					startDate.getDate()
				);
				while (currentDate <= endDate) {
					var cd = format_date(currentDate);
					dates.push(cd);

					currentDate = new Date(
						currentDate.getFullYear(),
						currentDate.getMonth(),
						currentDate.getDate() + 1, // Will increase month if over range
					);
				}
				return dates;
			};


			this._rpc({
				model: self.modelName,
				method: 'search_read',
				domain: [],
				fields : fields,
			},{async:false}).then(function (output) {
				console.log("largo: " + output.length);
				
				$.each(output, function( index, value ) {
					var color_codigo = '';
					var color_evento = '';
					color_codigo = value.color;
					if (color_codigo == 2) {
						// console.log("yellow: " + JSON.stringify(color_codigo));
						color_evento = 'orange'
					} 
					if (color_codigo == 4) {
						// console.log("blue: " + JSON.stringify(color_codigo));
						color_evento = 'blue'
					} 
					if (color_codigo == 10) {
						// console.log("green: " + JSON.stringify(color_codigo));
						color_evento = 'green'
					}
					if(date_stop){
						if(date_stop in value) {
							if(value[date_stop]){
								const dates = getDatesBetween(new Date(value[date_start]), new Date(value[date_stop]));
								$.each(dates, function( index, v1 ) {
									if(v1 in events)
									{
										events[v1]['ids'].push(value['id']);
										events[v1]['text'] += "  (&):" + value['name'];
									}
									else{
										events[v1] = new Event(value['name'], color_evento,[value['id']]);
									}
								});
							}
						}
					}
					else{
						if(date_start in value){
							if(value[date_start]){
								// console.log("value[date_start]: " + JSON.stringify(value[date_start]));
								// var new_dt = value[date_start].substring(0, 10);
								var new_dt = value.date_event.substring(0, 10);
								if(new_dt in events){
									events[new_dt]['ids'].push(value['id']);
									events[new_dt]['text'] += "  (&):" + value['name'];
								}else{
									events[new_dt] = new Event(value['name'], color_evento,[value['id']]);
									// console.log("color_evento: " + JSON.stringify(color_evento));
								}
							}
						}
					}
				});
			});

			_.each(['prev', 'today', 'next'], function (action) {
				self.$buttons.on('click', '.o_calendar_button_' + action, function () {
					if(current_scale =='year')
					{	if(action =='today')
						{
							year1 = (new Date).getFullYear();
						}
						else if(action =='prev')
						{
							year1 = year1 -1;
						}else{
							if(action =='next')
							{
								year1 = year1 + 1;
							}
						}
						$('#datepicker').datepicker('option', 'minDate', new Date(year1, 0, 1));
						$('#datepicker').datepicker('option', 'maxDate', new Date(year1, 11, 31));
						$("ol .breadcrumb").find('.active').text(year1);
						var list = document.getElementsByClassName("breadcrumb")[0];
						list.getElementsByClassName("active")[0].innerHTML = year1;
					}
					else{
						self.model[action]();
						self.reload();
					}
				});
			});
			_.each(['day', 'week', 'month','year'], function (scale) {
				self.$buttons.on('click', '.o_calendar_button_' + scale, function () {
					if(scale =='year')
					{
						self.$buttons.find('.o_calendar_button_' + scale).removeClass('active');
						$('.o_calendar_button_year').addClass('active');
						$(".o_calendar_view").find('.o_calendar_widget').hide();
						$(".o_calendar_view").find('.o_calendar_buttons').hide();
						$(".o_calendar_container").find('.o_calendar_sidebar_container').hide();

						$('.o_calendar_view').append('<div id="datepicker" class="mydate"></div>');
						if($("#datepicker").length == 0) {
							$('.o_calendar_view').append('<div id="datepicker" class="mydate"></div>');
						} else {
							$(".o_calendar_view").find('#datepicker').show();
						}
						$('.mydate').find('.ui-datepicker-inline').addClass('mydate-inline');							

						
						$("#datepicker").datepicker({
							numberOfMonths: [4, 3],
							// showWeek: true,
							firstDay: 1,
							minDate: new Date(year1, 0, 1),
							maxDate: new Date(year1, 11, 31),
							autoSize: true,

							onSelect: function(dateText, inst) {
								var qq = $(this).text();
								var date = $(this).val();
								var selectdate =  format_date(new Date(date));
								if (selectdate in events){
									var ids = events[selectdate]['ids'];
									var set4 = new Set(ids);
									var myArr = Array.from(set4);
									ids = myArr;
									if(ids.length > 1){
										self.do_action({
											type: 'ir.actions.act_window',
											res_model: self.modelName,
											views: [[false, 'list'], [false, 'form']],
											view_type: "list",
											view_mode: "list",
											target: 'current',
											domain:[['id','in',ids]]
										});
										
									}
									else{
										self.do_action({
											type: 'ir.actions.act_window',
											res_model: self.modelName,
											views:[[false, 'form']],
											res_id: ids[0],
											target: 'new'
										});
										
									}
								
								}else{
									if(self.mapping.date_start){
										context['default_' + self.mapping.date_start] = selectdate+" "+"00:00:00" || null;
									}
									if(self.mapping.date_stop){
										context['default_' + self.mapping.date_stop] = selectdate+" "+"23:59:59" || null;
									}


									new dialogs.FormViewDialog(self, {
										res_model: self.modelName,
										title: "Create",
										context : context,
										on_saved: function () {
											self._rpc({
												model: self.modelName,
												method: 'search_read',
												domain: [],
												fields : fields,
											},{async:false}).then(function (output) {
												$.each(output, function( index, value ) {
													var color_codigo = '';
													var color_evento = '';
													color_codigo = value.color;
													if (color_codigo == 2) {
														// console.log("yellow: " + JSON.stringify(color_codigo));
														color_evento = 'orange'
													} 
													if (color_codigo == 4) {
														// console.log("blue: " + JSON.stringify(color_codigo));
														color_evento = 'blue'
													} 
													if (color_codigo == 10) {
														// console.log("green: " + JSON.stringify(color_codigo));
														color_evento = 'green'
													}
													if(date_stop){
														if(date_stop in value) {
															if(value[date_stop]){
																const dates = getDatesBetween(new Date(value[date_start]), new Date(value[date_stop]));
																$.each(dates, function( index, v1 ) {
																	if(v1 in events)
																	{
																		events[v1]['ids'].push(value['id']);
																		events[v1]['text'] += "  (&):" + value['name'];
																	}
																	else{
																		events[v1] = new Event(value['name'], color_evento,[value['id']]);
																	}
																});
															}
														}
													}
													else{
														if(date_start in value){
															if(value[date_start]){
																// console.log("value[date_start]: " + JSON.stringify(value[date_start]));
																// var new_dt = value[date_start].substring(0, 10);
																var new_dt = value.date_event.substring(0, 10);
																if(new_dt in events){
																	events[new_dt]['ids'].push(value['id']);
																	events[new_dt]['text'] += "  (&):" + value['name'];
																}else{
																	events[new_dt] = new Event(value['name'], color_evento,[value['id']]);
																	// console.log("color_evento: " + JSON.stringify(color_evento));
																}
															}
														}
													}
												});
											});
											$("#datepicker").datepicker('option', 'beforeShowDay', renderCalendarCallback);
											
										},
									}).open();
									$( "#datepicker" ).datepicker("refresh");
									
								}
							},

							
						});

						$('.mydate').find('.ui-datepicker-inline').addClass('mydate-inline');
						$('.mydate-inline').find('.ui-datepicker-group').addClass('mydate-group');
						$('.mydate').find('.ui-state-default').addClass('mydate-state');

						$("#datepicker").datepicker('option', 'beforeShowDay', renderCalendarCallback);
						addCustomInformation();
						function renderCalendarCallback(date) {
							var year = date.getFullYear(),
							month = ("0" + (date.getMonth() + 1)).slice(-2),
							day = ("0" + (date.getDate())).slice(-2);
							addCustomInformation();
							var formatted = format_date(date);
							var event = events[formatted];
							if (event) {
								return [true, event.className, event.text];
							}
							else {
								return [true, '', ''];
							}
						}

						current_scale = scale;
						$("ol .breadcrumb").find('.active').text(year1);
						var list = document.getElementsByClassName("breadcrumb")[0];
						list.getElementsByClassName("active")[0].innerHTML = year1;

						$(".datepickerSelect").datepicker( 'option' , 'onSelect', function() {} );
					}
					else{
						$(".o_calendar_view").find('.o_calendar_widget').show(); 
						$(".o_calendar_view").find('.o_calendar_buttons').show(); 
						$(".o_calendar_container").find('.o_calendar_sidebar_container').show(); 
						$('.o_calendar_view').find('#datepicker').hide();
						self.model.setScale(scale);
						self.reload();
						current_scale = scale;
						self.$buttons.find('.o_calendar_button_' + scale).addClass('active');
					}
					
				});
			});

			function addCustomInformation() {
				setTimeout(function() {
					$('.mydate').find('.ui-datepicker-inline').addClass('mydate-inline');
					$('.mydate').find('.ui-datepicker-group').addClass('mydate-group');
					$('.mydate').find('.ui-state-default').addClass('mydate-state');

					var aa = $(".ui-datepicker-calendar td").each(function() {
						var selected_month = parseInt($(this).attr('data-month')) + 1;
						var selected_year = $(this).attr('data-year');
						var date = $(this).text();
						if (selected_month   < 10) {selected_month   = "0"+selected_month;}
						if (date < 10) {date = "0"+date;}
						
						var fdate = selected_year + '-' + selected_month + '-' + date;
						if(date){
							var event = events[fdate.toString()];
							if (event) {
								var txt = event['text'];
								if(txt.length > 30)
									txt = txt.slice(0,20)

								$(this).find(".mydate-state").attr('data-custom', txt);
								// $(this).find("a").append('<span class="raghavb">'+ event['text']+'</span>')
							}
						}
					})
				}, 0)
			}


			if ($node) {
				this.$buttons.appendTo($node);
			} else {
				this.$('.o_calendar_buttons').replaceWith(this.$buttons);
			}
			if(current_scale == 'year'){
				self.$buttons.find('.o_calendar_button_day').removeClass('active');
				self.$buttons.find('.o_calendar_button_week').removeClass('active');
				self.$buttons.find('.o_calendar_button_month').removeClass('active');
				self.$buttons.find('.o_calendar_button_year').addClass('active');
			}else{
				self.$buttons.find('.o_calendar_button_year').removeClass('active');
				self.$buttons.find('.o_calendar_button_' + current_scale).addClass('active');
			}
		},

	});

});
