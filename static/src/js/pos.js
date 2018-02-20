odoo.define('pos_create_so.pos_create_so', function (require) {
"use strict";

	var screens = require('point_of_sale.screens');
	var rpc = require('web.rpc');
	var core = require('web.core');
	var models = require('point_of_sale.models');
	var PopupWidget    = require('point_of_sale.popups');
	var gui = require('point_of_sale.gui');
	var _t = core._t;

	var SaleOrderPopupWidget = PopupWidget.extend({
	    template: 'SaleOrderPopupWidget',
	});
	gui.define_popup({name:'saleOrder', widget: SaleOrderPopupWidget});
	
	var SaleOrderButton = screens.ActionButtonWidget.extend({
	    template: 'SaleOrderButton',
	    button_click: function(){
	        var self = this;
	        var order = this.pos.get_order();
	        var currentOrderLines = order.get_orderlines();
	        if(currentOrderLines.length <= 0){
	            alert('No product selected !');
	        } else if(order.get_client() == null) {
	            alert('Customer is not selected !');
	        } else {
	            self.pos.create_sale_order();
	        }
	    },
	});
	
	screens.define_action_button({
	    'name': 'saleorder',
	    'widget': SaleOrderButton,
	    'condition': function(){
	        return this.pos.config.sale_order_operations == "draft" || this.pos.config.sale_order_operations == "confirm";
	    },
	});
	
	screens.PaymentScreenWidget.include({
		events: _.extend({}, screens.PaymentScreenWidget.prototype.events, {
			'click #btn_so': 'click_create_so',
		}),
		click_create_so: function(){
			var self = this;
			var order = self.pos.get_order();
			if(order){
    	        var currentOrderLines = order.get_orderlines();
                var paymentline_ids = [];
                if(order.get_paymentlines().length > 0){
                    if(currentOrderLines.length <= 0){
                        alert('Empty order');
                    } else if(order.get_client() == null) {
                        alert('Please select customer !');
                    } else {
                        $('#btn_so').hide();
                        self.pos.create_sale_order();
                    }
                }
			}
		},
		order_changes: function(){
	        var self = this;
	        var order = this.pos.get_order();
	        if (!order) {
	            return;
	        } else if (order.is_paid()) {
	            self.$('.next').addClass('highlight');
	            self.$('#btn_so').addClass('highlight');
	        }else{
	            self.$('.next').removeClass('highlight');
	            self.$('#btn_so').removeClass('highlight');
	        }
	    },
	});

	var _super_Order = models.Order.prototype;
	models.Order = models.Order.extend({
		set_sale_order_name: function(name){
			this.set('sale_order_name', name);
		},
		get_sale_order_name: function(){
			return this.get('sale_order_name');
		},
		export_for_printing: function(){
            var orders = _super_Order.export_for_printing.call(this);
            var new_val = {
            	sale_order_name: this.get_sale_order_name() || false,
            };
            $.extend(orders, new_val);
            return orders;
        },
	});

	var _super_posmodel = models.PosModel;
	models.PosModel = models.PosModel.extend({
		create_sale_order: function(){
            var self = this;
            var order = this.get_order();
	        var currentOrderLines = order.get_orderlines();
	        var customer_id = order.get_client().id;
	        var location_id = false;
	        var paymentlines = false;
	        var paid = false;
	        var confirm = false;
            var orderLines = [];
            for(var i=0; i<currentOrderLines.length;i++){
                orderLines.push(currentOrderLines[i].export_as_JSON());
            }
            if(self.config.sale_order_operations === "paid") {
                location_id = self.config.stock_location_id ? self.config.stock_location_id[0] : false;
                paymentlines = [];
                _.each(order.get_paymentlines(), function(paymentline){
                    paymentlines.push({
                        'journal_id': paymentline.cashregister.journal_id[0],
                        'amount': paymentline.get_amount(),
                    })
                });
                paid = true
            }
            if(self.config.sale_order_operations === "confirm"){
                confirm = true;
            }
            var params = {
            	model: 'sale.order',
            	method: 'create_sales_order',
            	args: [orderLines, customer_id, location_id, paymentlines],
            	context: {'confirm': confirm, 'paid': paid}
            }
            rpc.query(params, {async: false})
            .then(function(sale_order){
                if(sale_order.length > 0){
                    if(paid){
                        $('#btn_so').show();
                        order.set_sale_order_name(sale_order[1]);
                        order.initialize_validation_date();
                        self.gui.show_screen('receipt');
                    } else{
                        order.finalize();
                        var url = window.location.origin + '/web#id=' + sale_order[0] + '&view_type=form&model=sale.order';
                        self.gui.show_popup('saleOrder', {'url':url, 'name':sale_order[1]});
                    }
                }
            }).fail(function(err, event){
                if(paid){
                    $('#btn_so').show();
                }
                self.gui.show_popup('error',{
                    'title': _t('Error: Could not Save Changes'),
                });
            });
        },
	});
});

