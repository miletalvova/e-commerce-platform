var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var db = require('../models');
var CategoryService = require("../services/CategoryService")
var categoryService = new CategoryService(db);
var { isAuth, checkIfAdmin } = require("./authMiddlewares")

router.get('/', isAuth, async function(req, res, next) {
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Gets the list of all categories."
  	// #swagger.produces = ['application/json']
  	// #swagger.responses = [200]
	/* #swagger.responses[500] = {
         description: "Failed to retrieve categories",
         schema: { 
             result: "Failed to retrieve categories"
         }
     }*/
    try{
        const categories = await categoryService.getAll()
        res.status(200).json({ status: "success", statuscode: 200, data: { categories }} );
    } catch (error) {
        res.status(500).json( { status: "errror", statuscode: 500, data: { result: "Failed to retrieve categories", error: error.message }});
    }
});

router.post('/', jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Creates a new category."
  	// #swagger.produces = ['application/json']
  	/* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/Category"
      }
    }*/

	/* #swagger.responses[500] = {
         description: "Failed to create category",
         schema: { 
             result: "Failed to create category"
         }
     }*/
	/* #swagger.responses[404] = {
         description: "Bad request, missing required fields",
         schema: { 
             result: "Missing required fields: category"
         }
     }*/
    try {
        const { category } = req.body;
        if(!category) {
            res.status(404).json({ status: "error", statuscode: 404, data: { result: "Missing required fields: category"}})
        }
        const newCategory = await categoryService.createCategory(category)
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Category created successfully", category: newCategory }});
    } catch (error) {
        res.status(500).json( { status: "errror", statuscode: 500, data: { result: "Failed to create category", error: error.message }});
    }
});

router.put('/:id', jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Updates the category of ID or category name provided in the path. It can be either category name or ID"
  	// #swagger.produces = ['application/json']
    /* #swagger.parameters['id'] =  {
		"name": "id",
		"in": "path",
		"description": "ID or category name of the specific category to change/update",
    	"required": true
		}*/
  	// #swagger.responses = [200]
	/* #swagger.responses[500] = {
         description: "Failed to update category",
         schema: { 
             message: "Failed to update category"
         }
     }*/
    /* #swagger.responses[404] = {
         description: "Bad request, missing required fields",
         schema: { 
             message: "Missing required fields: category"
         }
     }*/
    try {
        const { id } = req.params;
        const { category } = req.body
        if(!category) {
            res.status(404).json({ status: "error", statuscode: 404, data: { result: "Missing required fields: category"}})
        }
        const updatedCategory = await categoryService.updateCategory(id, category);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Category updated successfully", category: updatedCategory }});
    } catch (error) {
        res.status(500).json( { status: "errror", statuscode: 500, data: { result: "Failed to update category", error: error.message }});
    }
});

router.delete('/:id', jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Deletes the category of ID provided in the path."
  	// #swagger.produces = ['application/json']
  	// #swagger.responses = [200]
	/* #swagger.responses[500] = {
         description: "Failed to delete category",
         schema: { 
             result: "Failed to delete category"
         }
     }*/
    try {
        let categoryId = req.params.id;
        const deletedCategory = await categoryService.deleteCategory(categoryId);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Category deleted successfully", category: deletedCategory }});
    } catch (error) {
        res.status(500).json( { status: "errror", statuscode: 500, data: { result: "Failed to delete category", error: error.message }});
    }
});


module.exports = router;
