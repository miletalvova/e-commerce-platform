var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var db = require('../models');
var BrandService = require("../services/BrandService")
var brandService = new BrandService(db);
var { isAuth, checkIfAdmin } = require("./authMiddlewares")

router.get('/', isAuth, async function(req, res, next) {
    // #swagger.tags = ['Brands']
  	// #swagger.description = "Gets the list of all brands."
  	// #swagger.produces = ['application/json']
  	// #swagger.responses = [200]
	/* #swagger.responses[500] = {
        description: "Server error",
        schema: { 
        status: "error",
            statuscode: 500,
            result: "Failed to retrieve brands"
            }
     }*/
    try{
        const brands = await brandService.getAll();
        /* const user = req.user; */
        res.status(200).json({ status: "success", statuscode: 200, data: { brands}} );
    } catch (error) {
        res.status(500).json( { status: "errror", statuscode: 500, data: { result: "Failed to retrieve brands", error: error.message }});
    }
});

router.post('/', jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Brands']
  	// #swagger.description = "Creates a new brand."
  	// #swagger.produces = ['application/json']
  	/* #swagger.parameters['body'] =  {
        "name": "body",
        "in": "body",
        "schema": {
            $ref: "#/definitions/Brand"
        }
    }*/

	/* #swagger.responses[500] = {
        description: "Failed to create a brand",
        schema: {
            status: "error",
            statuscode: 500,
            data: { result: "Failed to create a brand", error: "Error message" }
         }
     }*/
    /* #swagger.responses[404] = {
        description: "Missing required fields: brand",
        schema: { 
            status: "error",
            statuscode: 404,
            data: { result: "Missing required fields: brand" }
         }
     }*/
    try {
        const { brand } = req.body;
        if(!brand) {
            res.status(404).json({ status: "error", statuscode: 404, data:{ result: "Missing required fields: brand"}})
        }
        const newBrand = await brandService.createBrand(brand)
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Brand created successfully", brand: newBrand }});
    } catch (error) {
        res.status(500).json( { status: "errror", statuscode: 500, data: { result: "Failed to create a brand", error: error.message }});
    }
});

router.put('/:id', jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Brands']
  	// #swagger.description = "Updates the brand of ID or barnd name provided in the path. It can be a brand name or ID."
  	// #swagger.produces = ['application/json']
  	// #swagger.responses = [200]
	/* #swagger.responses[500] = {
        description: "Failed to update brand",
        schema: { 
            status: "error",
            statuscode: 500,
            data: { result: "Failed to update brand",  error: "Error message" }
         }
     }*/
    /* #swagger.responses[404] = {
        description: "Missing required fields: brand",
        schema: { 
            status: "error",
            statuscode: 404,
            data: { result: "Missing required fields: brand"}
         }
     }*/
    try {
        const { id } = req.params;
        const { brand } = req.body;
        if(!brand) {
            res.status(404).json({ status: "error", statuscode: 404, data:{ result: "Missing required fields: brand"}})
        }
        const updatedBrand = await brandService.updateBrand(id, brand);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Brand updated successfully", brand: updatedBrand }});
    } catch (error) {
        res.status(500).json( { status: "errror", statuscode: 500, data: { result: "Failed to update brand", error: error.message }});
    }
});

router.delete('/:id', jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Brands']
  	// #swagger.description = "Deletes the brand of ID provided in the path."
  	// #swagger.produces = ['application/json']
  	/* #swagger.responses = [200] = {
        description: "Product updated successfully.",
        schema: {
        status: "success",
        statuscode: 200,
        data: { 
        result: "Brand deleted successfully", 
        brand: { id: 1, brand: "deletedBrand" } }
        }
    }*/
	/* #swagger.responses[500] = {
        description: "Failed to delete brand",
        schema: { 
            status: "error",
            statuscode: 500,
            data: { result: "Failed to delete brand",  error: "Error message" }
         }
     }*/
    try {
        let brandId = req.params.id;
        const deletedBrand = await brandService.deleteBrand(brandId);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Brand deleted successfully", brand: deletedBrand } });
    } catch (error) {
        res.status(500).json( { status: "errror", statuscode: 500, data: { result: "Failed to delete brand", error: error.message }});
    }
});

module.exports = router;