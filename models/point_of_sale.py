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

from openerp import models, fields, api, _


class PosConfig(models.Model):
    _inherit = 'pos.config'

    sale_order_operations = fields.Selection([('draft','Quotations'),
                            ('confirm', 'Confirm'),('paid', 'Paid')], "Sale order operation", default="draft")

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: