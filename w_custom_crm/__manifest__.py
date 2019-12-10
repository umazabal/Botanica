# -*- encoding: utf-8 -*-
#
# Module written to Odoo, Open Source Management Solution
#
# Copyright (c) 2017 Telematel - http://www.telematel.com/
# All Rights Reserved.
#
# Developer(s): Alan Guzmán
#               (age@wedoo.tech)
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

{
    'name': 'TELEMATEL | Custom CRM',
    'author': 'TELEMATEL ©',
    'category': 'CRM',
    'sequence': 50,
    'summary': "Custom CRM",
    'website': 'https://www.telematel.com',
    'version': '1.0',
    'description': """
Custom CRM
==========

This module adds new fields to the kanban view of the crm, and adds a new tab
in the form view to add contacts.

    """,
    'depends': [
        'base',
        'crm',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/inherit_crm_lead_view.xml',
        'views/inherit_crm_stage_views.xml'
    ],
    'demo': [],
    'qweb': [],
    'installable': True,
    'application': False,
}
