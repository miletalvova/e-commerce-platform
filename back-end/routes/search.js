var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var db = require('../models');
var ProductService = require("../services/ProductService")
var productService = new ProductService(db);
var { isAuth } = require("./authMiddlewares")


router.post('/', jsonParser, async function(req, res, next) {
    // #swagger.tags = ['Search']
  	// #swagger.description = "Searches for the product by products name, brand or specified category."
  	// #swagger.produces = ['application/json']
  	/* #swagger.responses[200] = {
        description: "Product found",
        schema: { 
            status: "success",
            "statuscode": 200,
            data: { result: "Found product", records: 3}
         }
     }*/

	/* #swagger.responses[500] = {
        description: "Server error",
        schema: { 
            status: "error",
            statuscode: 500,
            data: { result: "Failed searching for products", error: "Error message" }
        }
     }*/
	
    try {
        const { name, brand, category } = req.body;
        const result = await productService.searchProduct(name, brand, category);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: result.Products, records: result.count }});
    } catch (error) {
        res.status(500).json( {status: "error", statuscode: 500, data: { result: "Failed searching for products", error: error.message }});
    }
});

module.exports = router;