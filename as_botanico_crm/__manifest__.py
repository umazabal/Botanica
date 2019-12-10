# -*- encoding: utf-8 -*-

{
    'name': 'Ahorasoft Customizaciones para CRM',
    'author': 'Ahorasoft',
    'category': 'Extra Tools',
    'sequence': 50,
    'summary': "Custom Lead fields",
    'website': 'http://www.ahorasoft.com',
    'version': '1.0',
    'description': """
Calendar year CRM
=================
    """,
    'depends': [
        'crm','crm_lead_custom'
    ],
    'installable': True,
    'data': [
        'views/as_crm_lead.xml',
        'data/data.xml',
    ],
    'demo': [],
    'qweb': [
    ],
    'application': False,
}
