var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var db = require('../models');
var UserService = require("../services/UserService")
var userService = new UserService(db);
var { checkIfAdmin, isAuth } = require("./authMiddlewares")


router.get('/roles', isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Users']
  	// #swagger.description = "Gets the list of all roles."
  	// #swagger.produces = ['application/json']
  	/* #swagger.responses[200] = {
        description: "Roles found.",
        schema: {
          status: "success",
          statuscode: 200,
          data: {
            result: "Roles found", 
            roles: [{ id: 1, role: "User" }]
          }
        }
    }*/

	/* #swagger.responses[500] = {
        description: "Server error",
        schema: {
          status: "error",
          statuscode: 500,
          data: {
            result: "Failed to retrieve roles", 
            error: "Error message"
          }
        }
    }*/
    /* #swagger.responses[404] = {
        description: "No roles found",
        schema: {
          status: "error",
          statuscode: 404,
          data: {
            result: "No roles found"
          }
        }
    }*/
  
    try{
      const roles = await userService.getRoles();
      if(!roles) {
          res.status(404).json({ status: "error", statuscode: 404, data: { result: "No roles found" }});
      }
      res.status(200).json({ status: "success", statuscode: 200, data: { result: "Roles found", roles }});
  } catch (error) {
      res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to retrieve roles", error: error.message }});
  }
});

router.get('/membership', isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Users']
  	// #swagger.description = "Gets the list of all memebership."
  	// #swagger.produces = ['application/json']

  	/* #swagger.responses[200] = {
        description: "Memberships found.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { 
                result: "Memberships found", 
                memberships: [{ id: 1, membership: "User" }]
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Server error",
        schema: {
            status: "error",
            statuscode: 500,
            data: { 
                result: "Failed to retrieve memberships", 
                error: "Error message"
            }
        }
    } */

    /* #swagger.responses[404] = {
        description: "No memberships found",
        schema: { 
            status: "error",
            statuscode: 404,
            data: { 
                result: "No memberships found"
            }
        }
    } */


    try{
        const memberships = await userService.getMemberships();
        if(!memberships) {
            res.status(404).json({ status: "error", statuscode: 404, data: { result: "No memberships found" }});
        }
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "Memberships found", memberships }});
    } catch (error) {
        res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to retrieve memberships", error: error.message}});
    }
  });

router.get('/', isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Users']
  	// #swagger.description = "Gets the list of all users."
  	// #swagger.produces = ['application/json']

  	/* #swagger.responses[200] = {
        description: "Users found.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { 
                result: "Users found",
                users: [{ id: 1, username: "user1" }]
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Server error",
        schema: {
            status: "error",
            statuscode: 500,
            data: { result: "Failed to retrieve users", error: "Error message" }
        }
    } */

    /* #swagger.responses[404] = {
        description: "No users found",
        schema: { 
            status: "error",
            statuscode: 404,
            data: { result: "No users found" }
        }
    } */

  try{
      const users = await userService.getUsers();
      if(!users) {
          res.status(404).json({ status: "error", statuscode: 404, data: { result: "No users found" }});
      }
      res.status(200).json({ status: "success", statuscode: 200, data: { result: "Users found", users }});
  } catch (error) {
      res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to retrieve users", error: error.message} });
  }
});

router.put('/:id',  jsonParser, isAuth, checkIfAdmin, async function(req, res, next) {
    // #swagger.tags = ['Users']
  	// #swagger.description = "Updates the user of ID provided in the path."
  	// #swagger.produces = ['application/json']

    /* #swagger.responses[200] = {
        description: "User updated successfully",
        schema: {
            status: "success",
            statuscode: 200,
            data: { result: "User updated successfully" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Server error",
        schema: {
            status: "error",
            statuscode: 500,
            data: { result: "Failed to update user", error: "Error message" }
        }
    } */

    try {
        const userId = req.params.id;
        const { firstname, lastname, email, username, address, phone, role, membership} = req.body;
        const updatedUser = await userService.updateUser(userId, firstname, lastname, email, username, address, phone, role, membership);
        res.status(200).json({ status: "success", statuscode: 200, data: { result: "User updated successfully", user: updatedUser} });
    } catch (error) {
        res.status(500).json( { status: "error", statuscode: 500, data: { result: "Failed to update user", error: error.message }});
    }
});

module.exports = router;
