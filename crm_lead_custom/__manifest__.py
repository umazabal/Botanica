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

{
    'name': 'WEDOO | Custom Lead fields',
    'author': 'WEDOO ©',
    'category': 'Extra Tools',
    'sequence': 50,
    'summary': "Custom Lead fields",
    'website': 'https://www.wedoo.tech',
    'version': '1.0',
    'description': """
Calendar year CRM
=================
    """,
    'depends': [
        'crm'
    ],
    'installable': True,
    'data': [
        'views/crm_lead_view.xml',
        'views/crm_calendar_view.xml'
    ],
    'demo': [],
    'qweb': [
    ],
    'application': False,
}
