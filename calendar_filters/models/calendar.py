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
