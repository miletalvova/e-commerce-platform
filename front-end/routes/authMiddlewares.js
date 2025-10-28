var jwt = require('jsonwebtoken');

module.exports = {
    isAuth: function(req, res, next) {
        if (!req.session.token) {
            return res.redirect('/login');
        }
        next();
    }
}