var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var db = require('../models');
var ProductService = require("../services/ProductService")
var productService = new ProductService(db);
var { checkIfAdmin, isAuth } = require("./authMiddlewares")

router.get('/', async function(req, res, next) {
    try{
        // #swagger.tags = ['Products']
        // #swagger.description = "Gets the list of all products."
        // #swagger.produces = ['application/json']
        /* #swagger.responses[200]= {
            description: "Products retrieved successfully.",
            schema: {
                status: "success",
                statuscode: 200,
                data: {
                    result: "Products found",
                    products: [{ "id": 1, "name": "Product", "description": "Description", "price": 100, "quantity": 10, "date_added": "2022-05-01", "imgurl": "http://img.png", "isDeleted": 0, "BrandId": 1, "CategoryId": 1, "brand": "Brand", "category": "Category"}]
                }
            }
        } */

        /* #swagger.responses[500] = {
            description: "Server error",
            schema: { 
                status: "error",
                statuscode: 500,
                    data: {
                    result: "Failed to retrieve products", error: "Error message" }
            }
        } */

       /* #swagger.responses[404] = {
            description: "No products found",
            schema: { 
                status: "error",
                statuscode: 404,
                data: { result: "No products found" }
            }
        }*/

        const products = await productService.getAll();
        /* const user = req.user; */
        if(!products) {
            res.status(404).json({ status: "errror", statuscode: 404, data: { result: "No products found", products }});
        }
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Products found", products}});
    } catch (error) {
        res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to retrieve products", error: error.message }});
    }
});

router.get('/:name', isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Products']
  	// #swagger.description = "Gets the products of name provided in the path."
  	// #swagger.produces = ['application/json']

  	/* #swagger.responses[200] = {
        description: "Product found successfully.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { id: 1, name: "Product Name", description: "Description", price: 100 }
        }
    }*/
	/* #swagger.responses[500] = {
        description: "Server error",
        schema: { 
            status: "error",
            statuscode: 500,
            data: { result: "Failed to get the product", error: "Error message" }
        }
     }*/
    /* #swagger.responses[404] = {
        description: "Product not found",
        schema: { 
            status: "error",
            statuscode: 404,
            data: { result: "No products found" }
         }
     }*/
    try {
        const productName = req.params.name;
        const product = await productService.getProductByName(productName);
        if(!product){
            res.status(404).json({ status: "error", data: { result: "No products found"}})
        }
        
        res.status(200).json({ status: "success", statuscode: 200, data: product });
    } catch (error) {
        res.status(500).json({ status: "error", statuscode: 500, data: { result: "Failed to get the product", error: error.message }});
    }
});

router.post('/add', jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Products']
  	// #swagger.description = "Creates a new product."
  	// #swagger.produces = ['application/json']

    /*  #swagger.responses[200] = {
        description: "Product created successfully.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { result: "Product created successfully", product: { id: 1, name: "Product" } }
            }
        }
    }*/

	/* #swagger.responses[500] = {
        description: "Server error",
        schema: { 
            status: "error",
            statuscode: 500,
            data: { result: "Failed to create product", error: "Error message" }
         }
     }*/
    /* #swagger.responses[404] = {
        description: "Missing required fields",
        schema: { 
            status: "error",
            statuscode: 400,
            data: { result: "Missing required fields" }
         }
     }*/

    try {
        const { name, description, price, quantity, date_added, imgurl, brand, category } = req.body;
        if(!name || !description || !price || !quantity || !brand || !category) {
            res.status(404).json({ status: "error", statuscode: 404, data: { result: "Missing required fields" }})
        }
        const product = await productService.createProduct(name, description, price, quantity, date_added, imgurl, brand, category);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Product created successfully", product }});
    } catch (error) {
        res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to create product", error: error.message }});
    }
});

router.put('/edit/:id', jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Products']
  	// #swagger.description = "Updates the product of ID provided in the path."
  	// #swagger.produces = ['application/json']
  	/* #swagger.responses[200] = {
        description: "Product updated successfully.",
            schema: {
            status: "success",
            statuscode: 200,
            data: { result: "Product updated successfully", product: { id: 1, name: "Updated Product" } }
            }
    }*/
	/* #swagger.responses[500] = {
        description: "Server error",
            schema: { 
            status: "error",
            statuscode: 500,
            data: { result: "Failed to update product", error: "Error message" }
         }
     }*/
    try {
        const productId = req.params.id;
        const { name, description, price, quantity, imgurl, brand, category} = req.body;
        const updatedProduct = await productService.updateProduct(productId, name, description, price, quantity, imgurl, brand, category);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Product updated successfully", product: updatedProduct} });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to update product", error: error.message }});
    }
});


router.delete('/:id', jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Products']
  	// #swagger.description = "Deletes the product of ID provided in the path."
  	// #swagger.produces = ['application/json']
  	/* #swagger.responses = [200] = {
        status: "success",
        statuscode: 200,
        data: { result: "Product deleted successfully", product: { id: 1, name: "Deleted Product" } }
    }*/
	/* #swagger.responses[500] = {
         description: "Server error",
         schema: { 
             result: "Failed to delete product"
         }
     }*/
    try {
        let productId = req.params.id;
        const deletedProduct = await productService.deleteProduct(productId);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Product deleted successfully", product: deletedProduct } });
    } catch (error) {
        res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to delete product", error: error.message }});
    }
});

module.exports = router;