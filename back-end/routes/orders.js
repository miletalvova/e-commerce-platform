var express = require('express');
var router = express.Router();
var db = require("../models");
var OrderService = require("../services/OrderService")
var orderService = new OrderService(db);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var { isAuth, checkIfAdmin } = require("./authMiddlewares")

router.get('/', isAuth, async function(req, res, next) {
    // #swagger.tags = ['Orders']
	// #swagger.description = "Returns a the list of the user orders."
	// #swagger.produces = ['application/json']
	// #swagger.responses = [200]
	/* #swagger.responses[500] = {
		description: "Failed to retrieve the orders",
		schema: { 
             message: "Failed to retrieve the orders"
         }
	} */


    try{
        UserId = req.user.id
        const orders = await orderService.getOrders(UserId)
        res.status(200).json({ status: "success", statuscode: 200, data: orders } );
    } catch (error) {
        res.status(500).json({ status: "error", statuscode: 500, data: { result: "Failed to retrieve the orders", error: error.message }});
    }
});

router.put('/:id', jsonParser, isAuth, checkIfAdmin,  async function(req, res, next) {
    // #swagger.tags = ['Orders']
    // #swagger.description = "Updates the status of a specific order by its ID."
    // #swagger.produces = ['application/json']

	/* #swagger.parameters['id'] = {
        name: 'id',
        in: 'path',
        description: 'ID of the specific user\'s order',
        required: true,
        type: 'string'
    } */
        
	/* #swagger.parameters['OrderStatus'] = {
        name: 'OrderStatus',
        in: 'body',
        description: 'New status to update the order with',
        required: true,
        schema: { 
            properties: { 
                OrderStatus: {
                    example: 'Ordered'
                }
            }
        }
    } */

    /* #swagger.responses[500] = {
         description: "Failed to update order status",
         schema: { 
             status: "error",
             statuscode: 500,
             data: {
                 result: "Failed to update order status",
                 error: "Error message"
             }
         }
     } */


    try {
        const { id } = req.params;
        const { OrderStatus } = req.body;
        const status = await orderService.updateStatus(id, OrderStatus);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Order Status updated successfully", status }});
    } catch (error) {
        res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to update order status", error: error.message }});
    }
});

router.get('/statuses', isAuth, async function(req, res, next) {
    // #swagger.tags = ['Orders']
	// #swagger.description = "Returns a the list of all order statuses."
	// #swagger.produces = ['application/json']
	// #swagger.responses = [200]
	/* #swagger.responses[500] = {
		description: "Failed to retrieve statuses",
		schema: { 
             message: "Failed to retrieve statuses"
         }
	} */
    try{
        const statuses = await orderService.getAll()
        res.status(200).json({ status: "success", statuscode: 200, data: { statuses } } );
    } catch (error) {
        res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to retrieve statuses", error: error.message }});
    }
});


module.exports = router;