# -*- encoding: utf-8 -*-

from odoo import api, fields, models, _
from odoo.exceptions import UserError
from datetime import datetime
import time

import logging
_logger = logging.getLogger(__name__)

class as_crm_stage(models.Model):

    _inherit = "crm.stage"

    as_done = fields.Boolean("Realizado", default=False, readonly=True)
    as_win = fields.Boolean("Ganado", default=False, readonly=True)
    
    def as_disable(self, field):
        where_clause_params = ''
        query = "update crm_stage set " + field + " = False;"
        self.env.cr.execute(query)

    def activar_realizado(self):
        self.as_disable('as_done')
        self.as_done = True

    def activar_ganado(self):
        self.as_disable('as_win')
        self.as_win = True
                
    def as_transfer_green_done(self):
        as_stage_win = self.env['crm.stage'].search([('as_win','=', True)],limit=1)
        as_stage_done = self.env['crm.stage'].search([('as_done','=', True)],limit=1)
        
        now = datetime.now()
        date_format = "%Y-%m-%d"
        
        today = fields.Date.today()
        _logger.debug("\n\n\nlead.today: %s", str(today))
        
        
        if as_stage_done and as_stage_win:
            query = "update crm_lead set stage_id = " + str(as_stage_done.id) + " where stage_id = " + str(as_stage_win.id) + " and date_event <= '" + today + "';"
            _logger.debug("\n\n\nquery: %s", str(query))
            self.env.cr.execute(query)        