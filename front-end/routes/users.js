var express = require('express');
var router = express.Router();
var axios = require('axios');
var { isAuth } = require("./authMiddlewares");

router.get('/', isAuth, async function(req, res) {
  try {
    const response = await axios.get('http://localhost:3000/users', {headers: { Authorization: `Bearer ${req.session.token}`}});
    const users = response.data.data.users;

    const result = await axios.get('http://localhost:3000/users/roles', {headers: { Authorization: `Bearer ${req.session.token}`}});
    const roles = result.data.data.roles;

    const members = await axios.get('http://localhost:3000/users/membership', {headers: { Authorization: `Bearer ${req.session.token}`}});
    const memberships = members.data.data.memberships;
    res.render('users', { users, roles, memberships });
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

router.put('/:id', isAuth, async function(req, res) {
  const userId = req.params.id;
  const { firstname, lastname, email, username, address, phone, role, membership } = req.body;
  try {
    await axios.put(`http://localhost:3000/users/${userId}`, {userId, firstname, lastname, email, username, address, phone, role, membership},
      { headers: {Authorization: `Bearer ${req.session.token}` }});
    res.json({ success: true });
} catch (error) {
    res.render('error', { error: error.message });
}
});

module.exports = router;
