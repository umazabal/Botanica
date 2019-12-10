# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models


class Stage(models.Model):

    _inherit = "crm.stage"

    unique_lead = fields.Boolean('Only event',default= False, help='This mark indicates that there can only be one event at this stage.')

