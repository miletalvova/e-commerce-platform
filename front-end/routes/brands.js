var express = require('express');
var router = express.Router();
var axios = require('axios');
var { isAuth } = require("./authMiddlewares");

router.get('/', isAuth, async function(req, res) {
  try {
    const response = await axios.get('http://localhost:3000/brands', { headers: { Authorization: `Bearer ${req.session.token}` }});
    const brands = response.data.data.brands;
    res.render('brands', { brands });
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

router.post('/', isAuth, async function(req, res) {
  const { brand } = req.body;
  try {
      await axios.post('http://localhost:3000/brands', { brand },
        {headers: { Authorization: `Bearer ${req.session.token}`}});
        res.json({ success: true });
  } catch (error) {
      res.render('error', { error: error.message });
  }
});

router.put('/:id', isAuth, async function(req, res) {
  const brandId = req.params.id;
  const { brand } = req.body;
  try {
    await axios.put(`http://localhost:3000/brands/${brandId}`, { brand },
      { headers: {Authorization: `Bearer ${req.session.token}` }});
    res.json({ success: true });
} catch (error) {
    res.render('error', { error: error.message });
}
});

router.post('/:id', isAuth, async (req, res) => {
  const brandId = req.params.id;
  try {
      await axios.delete(`http://localhost:3000/brands/${brandId}`, {
          headers: { Authorization: `Bearer ${req.session.token}` }
      });
      res.redirect('/brands');
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

module.exports = router;