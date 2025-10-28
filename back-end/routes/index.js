var express = require('express');
require('dotenv').config()
var router = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var path = require('path')
var fs = require('fs');
var axios = require('axios');
var db = require("../models");
var UserService = require("../services/UserService")
var userService = new UserService(db);
const { QueryTypes } = require("sequelize");
var populateService = require("../services/PopulateService");
var ProductService = require("../services/ProductService")
var productService = new ProductService(db);
var BrandService = require("../services/BrandService")
var brandService = new BrandService(db);
var CategoryService = require("../services/CategoryService")
var categoryService = new CategoryService(db);


/* GET home page. */
router.get('/', function(req, res, next) {
  // #swagger.tags = ['Home']
  // #swagger.description = "Renders the home page with a title."
  // #swagger.produces = ['text/html']

  /* #swagger.responses[200] = { 
      description: "Home page rendered successfully."
   }*/
  
  res.render('index', { title: 'Express' });
});

router.post("/login", async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = "Post for registered users to be able to login. Both email/username and password need to be correct. After successful login, the JWT token is returned - use it later in Authorization header to access the other endoints."
  // #swagger.produces = ['application/json']
  /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/User"
        }
      }*/

  /* #swagger.responses[200] = {
     description: "Login successful, JWT token returned.",
     schema: {
       status: "success",
       statuscode: 200,
       data: {
         result: "You are logged in",
         id: 1,
         email: "johnnyDoe@gmail.com",
         name: "Username",
         token: "jwt-token",
         role: "User"
       }
     }
   } */

  /* #swagger.responses[500] = {
         description: "Server error",
         schema: { 
             message: "Server error"
         }
    }*/


  const { credentials, password } = req.body;
  if (!credentials) {
    return res.status(401).json({ status: "error", statuscode: 401, data: { result: "Email or Username are required." }});
    }
    if (!password) {
      return res.status(401).json({ status: "error", statuscode: 401, data: { result: "Password is required." }});
    }
    try {
      const data = await userService.getOne(credentials);

      if(!data) {
        return res.status(401).json({ status: "error", statuscode: 401, result: "Incorrect email, username or password"});
      }
      crypto.pbkdf2(password, data.Salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { 
          return res.status(500).json({ status: "error", statuscode: 500, result: "Error occured"}); 
        }
        if (!crypto.timingSafeEqual(data.EncryptedPassword, hashedPassword)) {
          return res.status(401).json({ status: "error", statuscode: 401, result: "Incorrect email, username or password"});
        }
        let token;
          try {
          token = jwt.sign(
              { id: data.id, email: data.Email, username: data.Username, role: data.Role.role },
              process.env.TOKEN_SECRET,
              { expiresIn: "2h" }
          );
          } catch (err) {
            return res.status(500).json({ status: "error", statuscode: 500, result: "Something went wrong with creating JWT token"})
          }
          req.session.token = token;
          res.status(200).json({ status: "success", statuscode: 200, data: { result: "You are logged in", "id": data.id, "email": data.Email, "name": data.Username, token: token, "role": data.Role.role }} );
      });
  } catch (err) {
    return res.status(500).json({ status: "error", statuscode: 500, "error": "Server error"})
  }
});

router.post("/auth/register", async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = "User registration endpoint. Registers a new user with required fields such as firstname, lastname, email, username, address, phone and password."
  // #swagger.produces = ['application/json']

   /* #swagger.responses[200] = {
     description: "Registration successful.",
     schema: {
       status: "success",
       statuscode: 200,
       data: { result: "You created an account." }
     }
    } */

   /* #swagger.responses[401] = { 
   description: "Bad request - Missing required fiields or invalid data."
   } */

  const { firstname, lastname, email, username, address, phone, password } = req.body;
    if (firstname == null) {
      return res.status(401).json({ status: "error", statuscode: 401, data: { result: "Name is required." }});
    }
    if (lastname == null) {
      return res.status(401).json({ status: "error", statuscode: 401, data: { result: "Name is required." }});
    }
    if (email == null) {
      return res.status(401).json({ status: "error", statuscode: 401, data: { result: "Email is required." }});
    }
    if (password == null) {
      return res.status(401).json({ status: "error", statuscode: 401,  data: { result: "Password is required." }});
    }
    if (username == null) {
      return res.status(401).json({ status: "error", statuscode: 401,  data: { result: "username is required." }});
    }
    if (address == null) {
      return res.status(401).json({ status: "error", statuscode: 401,  data: { result: "Address is required." }});
    }
    if (phone == null) {
      return res.status(401).json({ status: "error", statuscode: 401,  data: { result: "Phone is required." }});
    }
    var user = await userService.getOne(email, username);
    if (user != null) {
      return res.status(401).json({ status: "error", statuscode: 401, data: { result: "Provided email is already in use." }});
    }
  var Salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, Salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return next(err); }
      userService.create(firstname, lastname, email, username, address, phone, hashedPassword, Salt)
      res.status(200).json({ status: "success", statuscode: 200, data: { result: "You created an account." }} );
    });
});

const fetchData = async () => {
  try {
    const response = await axios.get('http://backend.restapi.co.za/items/products')
    const products = response.data.data;
    fs.writeFileSync(path.resolve(__dirname, '../data/products.json'), JSON.stringify(products));
    console.log('Data saved')
  } catch (error) {
    console.error(error);
  }
}

//Initialize the database
router.post('/init', async function(req, res, next) {
  await fetchData();
  if (await CheckIfDBHasData()) {
    console.log('No records in the Product table, populating the database');
    await populateService.populate('roles.json');
    await populateService.populate('memberships.json');
    await populateService.populate('statuses.json');
    await userService.populate('users.json');
    await brandService.populate();
    await categoryService.populate();
    await productService.populate();
    console.log('Database populated successfully.');
  } else {
    console.log('No records added, The database is already populated');
  }
  res.end();
});

const CheckIfDBHasData = async () => {
  let result = await db.sequelize.query('SELECT COUNT(*) as total FROM Products', {
    raw: true,
    type: QueryTypes.SELECT,
  });
  if(result[0].total == 0) {
    return true;
  }
  return false;
}

module.exports = router;