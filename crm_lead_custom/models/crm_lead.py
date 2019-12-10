# -*- encoding: utf-8 -*-
#
# Module written to Odoo, Open Source Management Solution
#
# Copyright (c) 2018 Wedoo - http://www.wedoo.tech/
# All Rights Reserved.
#
# Developer(s): Ernesto García Medina
#               (ernesto.garcia@telematel.com)
#
########################################################################
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
########################################################################

from odoo import api, fields, models, _
from odoo.exceptions import UserError
import logging
_logger = logging.getLogger(__name__)


class CrmLead(models.Model):

    _inherit = "crm.lead"


    date_event = fields.Date()
    meet_qty = fields.Integer()
    color = fields.Integer('Color Index', default=1000)

    @api.model
    def check_date_event(self, date, stage_id):
        events_found = self.search_count([('date_event', '=', date),('stage_id', '=', stage_id.id)])
        if events_found:
            raise UserError(_("You can not create more that one event, into the same date for leads"))

    @api.model
    def create(self, vals):
        context = dict(self._context or {})
        # stage_id = self.env['crm.stage'].search([('id','=', vals.get('stage_id', False))])
        if vals.get('date_event', False):
            # self.check_date_event(vals.get('date_event'), stage_id)
            unique_stages = self.env['crm.stage'].search([('unique_lead','=', True)])
            unique_date_events = self.search_count([
                ('date_event', '=', vals.get('date_event')),
                ('stage_id', 'in', [ustage.id for ustage in unique_stages])
            ])
            print("Trieufriend:", unique_date_events)
            if unique_date_events > 0:
                raise UserError(_("You cannot create more opportunities, chosen event date is blocked."))
        return super(CrmLead, self.with_context(context, mail_create_nolog=True)).create(vals)

    @api.multi
    def write(self, values):
        stage_obj = self.env['crm.stage']
        
        if values.get('date_event', False) and values.get('stage_id', False):
            stage_id =  stage_obj.browse(values.get('stage_id'))
            if stage_id.unique_lead:
                self.check_date_event(values.get('date_event'),stage_id)
            if stage_id.color_index:
                values.update({'color': stage_id.color_index})
        elif  values.get('date_event', False):
            if self.stage_id.unique_lead:
                self.check_date_event(values.get('date_event'),self.stage_id)
        elif values.get('stage_id', False): 
            stage_id =  stage_obj.browse(values.get('stage_id'))
            if stage_id.unique_lead:
                self.check_date_event(self.date_event,stage_id)
            if stage_id.color_index:
                values.update({'color': stage_id.color_index})
#         if values.get('stage_id', False):
#             stage_id = stage_obj.browse(values.get('stage_id', False))
#             if stage_id.color_index:
#                 values.update({'color': stage_id.color_index})
        super(CrmLead, self).write(values)


class CrmStage(models.Model):

    _inherit = "crm.stage"

    color_index = fields.Selection(
        selection=[('1000', 'White'), ('2', 'Orange'), ('3', 'Yellow'), ('4', 'Blue'), ('10', 'Green')],
        default='1000',
        string="Kanban Color"
    )

