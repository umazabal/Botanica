# -*- coding: utf-8 -*-
{
	"name" : "Ahorasoft Calendario",
	"version" : "11.0.0.1",
	"depends" : ['base','calendar','crm_lead_custom'],
	'category': 'Calendar',
	'version': '0.1',
	"description": """ Calendar Filters""",
	'summary': 'Calendar Filters',
	"data": [
		'views/calendar_view.xml',
	],
	'qweb': [
		'static/src/xml/calendar.xml',
	],
	"auto_install": False,
	"installable": True,
}
