# -*- coding: utf-8 -*-
#################################################################################
# Author      : Acespritech Solutions Pvt. Ltd. (<www.acespritech.com>)
# Copyright(c): 2012-Present Acespritech Solutions Pvt. Ltd.
# All Rights Reserved.
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#################################################################################

{
    "name" : "Create sales order from Point of Sale",
    'summary' : "Create sales order quotation from point of sale with customer.",
    "version" : "1.0",
    "description": """
        This module helps to create sales order from point of sale without opening sales order form.
    """,
    'author' : 'Acespritech Solutions Pvt. Ltd.',
    'category' : 'Point of Sale',
    'website' : 'http://www.acespritech.com',
    'price': 60,
    'currency': 'EUR',
    'images': ['static/description/main_screenshot.png'],
    "depends" : ['sale_management', 'point_of_sale'],
    "data" : [
        'views/pos_create_so.xml',
        'views/point_of_sale_view.xml'
    ],
    'qweb': ['static/src/xml/pos.xml',],
    "auto_install": False,
    "installable": True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: