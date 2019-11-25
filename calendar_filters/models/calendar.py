# -*- coding: utf-8 -*-

from odoo import api, fields, models, _
import dateutil.parser
from datetime import datetime, timedelta


class CalendarEvents(models.Model):
	_inherit = 'calendar.event'

	@api.model
	def default_get(self, fields):
		res = super(CalendarEvents, self).default_get(fields)
		res.update({'start_datetime': datetime.now()})
		return res


	# def get_event_dates(self,obj,start,stop):
	# 	dates = []
	# 	print(start,stop,"object ttttttttttttttttttt",obj,self.env[""+obj+""]._fields)
	# 	event_dates = self.env["'"+obj+"'"].search([])
	# 	# for field in self.env[""+obj+""]._fields:
	# 	# 	print("fields -----------",field)
	# 	# 	if start == field :
	# 	# 		for e in event_dates :
	# 	# 			dt = dateutil.parser.parse(e.start).date()
	# 	# 			dates.append(str(dt))
	# 	# 			print(e,"------------------------",e.start)
	# 	return dates

