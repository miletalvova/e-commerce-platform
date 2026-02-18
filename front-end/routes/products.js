var express = require('express');
var router = express.Router();
var axios = require('axios');
var { isAuth } = require("./authMiddlewares");

router.get('/', isAuth, async function(req, res) {
  try {
    const result = await axios.get('http://localhost:3000/products', {headers: { Authorization: `Bearer ${req.session.token}`}});
    const products = result.data.data.products;

    const response = await axios.get('http://localhost:3000/brands', { headers: { Authorization: `Bearer ${req.session.token}` }});
    const brands = response.data.data.brands;

    const dataCategories = await axios.get('http://localhost:3000/categories', { headers: { Authorization: `Bearer ${req.session.token}` }});
    const categories = dataCategories.data.data.categories;
    
    res.render('products', { products, brands, categories});
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

router.post('/add', isAuth, async function(req, res) {
  const { name, description, price, quantity, date_added, imgurl, brand, category } = req.body;
  try {
      await axios.post('http://localhost:3000/products/add', {name, description, price, quantity, date_added, imgurl, brand, category},
        {headers: { Authorization: `Bearer ${req.session.token}`}});
          res.json({ success: true });
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

router.put('/edit/:id', isAuth, async function(req, res) {
  const productId = req.params.id;
  const { name, description, price, quantity, imgurl, brand, category } = req.body;
  try {
    await axios.put(`http://localhost:3000/products/edit/${productId}`, {name, description, price, quantity, imgurl, brand, category},
      { headers: {Authorization: `Bearer ${req.session.token}` }});
    res.json({ success: true });
} catch (error) {
    res.render('error', { error: error.message });
}
});

router.post('/delete/:id', isAuth, async (req, res) => {
  const productId = req.params.id;
  try {
      await axios.delete(`http://localhost:3000/products/${productId}`, {
          headers: { Authorization: `Bearer ${req.session.token}` }
      });
      res.redirect('/products');
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

router.post('/search', isAuth, async (req, res) => {
  const { name, brand, category } = req.body;
  try {
    const response = await axios.post(`http://localhost:3000/search`, { name, brand, category }, {
          headers: { Authorization: `Bearer ${req.session.token}` }
      });
      res.json(response.data);
      /* console.log(response.data) */
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

module.exports = router;