var express = require('express');
var router = express.Router();
var axios = require('axios');
var { isAuth } = require("./authMiddlewares");

router.get('/', isAuth, async function(req, res) {
  try {
    const response = await axios.get('http://localhost:3000/categories', { headers: { Authorization: `Bearer ${req.session.token}` }});
    const categories = response.data.data.categories;
    res.render('categories', { categories });
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

router.post('/', isAuth, async function(req, res) {
  const { category } = req.body;
  try {
      await axios.post('http://localhost:3000/categories', { category }, { headers: { Authorization: `Bearer ${req.session.token}`}});
        res.json({ success: true });
  } catch (error) {
      res.render('error', { error: error.message });
  }
});

router.put('/:id', isAuth, async function(req, res) {
  const categoryId = req.params.id;
  const { category } = req.body;
  try {
    await axios.put(`http://localhost:3000/categories/${categoryId}`, { category },
      { headers: {Authorization: `Bearer ${req.session.token}` }});
    res.json({ success: true });
} catch (error) {
    res.render('error', { error: error.message });
}
});

router.post('/:id', isAuth, async (req, res) => {
  const categoryId = req.params.id;
  try {
      await axios.delete(`http://localhost:3000/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${req.session.token}` }
      });
      res.redirect('/categories');
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

module.exports = router;