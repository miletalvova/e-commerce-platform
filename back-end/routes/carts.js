var express = require('express');
var router = express.Router();
var db = require("../models");
var CartService = require("../services/CartService")
var cartService = new CartService(db);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var { isAuth } = require("./authMiddlewares")

router.post('/', jsonParser, isAuth, async function(req, res, next) {
    // #swagger.tags = ['Carts']
  	// #swagger.description = "Creates a new cart for a user."
  	// #swagger.produces = ['application/json']
  	/* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/Cart"
      }
    }*/

	/* #swagger.responses[500] = {
         description: "Failed to create cart",
         schema: { 
             result: "Failed to create cart"
         }
     }*/
    /* #swagger.responses[404] = {
         description: "Bad request, missing required fields",
         schema: { 
             message: "Missing required fields"
         }
     }*/

    try {
        const { quantity, ProductId } = req.body;
        const UserId = req.user.id;
        if(!quantity || !ProductId){
            res.status(404).json({ status: "error", statuscode: 404, data: { result: "Missing required fields"}})
        }
        let result = await cartService.createCart(UserId, ProductId, quantity);
        res.status(200).json({ status: "success", statuscode: 200, result });
    } catch (error) {
        console.error(error.error);
        res.status(400).json({ status: "error", data: { result: "Failed to create cart", message: error.message }});
    }
});

router.post('/checkout/now', jsonParser, isAuth, async function(req, res, next) {
    // #swagger.tags = ['Carts']
  	// #swagger.description = "Checks out the cart."
  	// #swagger.produces = ['application/json']
  	// #swagger.responses = [200]
	/* #swagger.responses[500] = {
         description: "Failed to check out the cart",
         schema: { 
             result: "Failed to check out the cart"
         }
     }*/
    try {
        const result = await cartService.checkout(req.user.id)
        res.status(200).json({ status: "success", statuscode: 200, result });
    } catch (error) {
        res.status(500).json({ status: "error", data: { result: "Failed to check out the cart", message: error.message }});
    }
  });

module.exports = router;