var express = require('express');
var router = express.Router();
var axios = require('axios');
var { isAuth } = require("./authMiddlewares");

router.get('/', isAuth, async function(req, res) {
  try {
    const response = await axios.get('http://localhost:3000/users/roles', {headers: { Authorization: `Bearer ${req.session.token}`}});
    const roles = response.data.data.roles;
    res.render('roles', { roles });
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

module.exports = router;