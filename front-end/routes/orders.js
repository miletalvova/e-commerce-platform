var express = require('express');
var router = express.Router();
var axios = require('axios');
var { isAuth } = require("./authMiddlewares");

router.get('/', isAuth, async function(req, res) {
  try {
    /* const userId = req.session.userId; */
    const response = await axios.get('http://localhost:3000/orders', { headers: { Authorization: `Bearer ${req.session.token}`}});
    const orders = response.data.data.orders;

    const result = await axios.get('http://localhost:3000/orders/statuses',  
      {headers: { Authorization: `Bearer ${req.session.token}`}});
      const statuses = result.data.data.statuses;

    res.render('orders', { orders, statuses });
  } catch (error) {
    console.log(error);
    res.render('error', { error: error.message });
  }
});

router.get('/details', isAuth, async function(req, res) {
    try {
      const response = await axios.get('http://localhost:3000/orders', {headers: { Authorization: `Bearer ${req.session.token}`}});
      const orders = response.data.data.orders;
      console.log(orders)
      res.render('order', { orders });
    } catch (error) {
      res.render('error', { error: error.message });
    }
  });

  router.put('/:id', isAuth, async function(req, res) {
    const orderId = req.params.id;
    const { OrderStatus } = req.body;
    try {
      await axios.put(`http://localhost:3000/orders/${orderId}`, { OrderStatus },
        { headers: {Authorization: `Bearer ${req.session.token}` }});
      res.json({ success: true });
  } catch (error) {
      console.error(error);
      res.render('error', { error: error.message });
  }
  });


module.exports = router;