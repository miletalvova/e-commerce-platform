var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { credentials, password } = req.body;
  try {
    const response = await axios.post('http://localhost:3000/login', { credentials: credentials, password });
    const token = response.data.data.token;
    const userId = response.data.data.id;
    const userRole = response.data.data.role;
    req.session.token = token;
    req.session.userId = userId;
    req.session.userRole = userRole;
      if (req.session.userRole === 'Admin') {
        res.redirect('/products');
      } else {
      res.render('login', { error: 'Access denied. Only admins can log in.' });
      }
  } catch (error) {
      res.render('login', { error: 'Login failed' });
  }
});

module.exports = router;