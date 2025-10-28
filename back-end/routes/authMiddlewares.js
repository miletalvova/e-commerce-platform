const db = require("../models");
var jwt = require('jsonwebtoken');
var UserService = require("../services/UserService")
var userService = new UserService(db);

module.exports = {
    checkIfAdmin: async function(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) {
            return res.status(401).json({ statuscode: 401, result: "Unathorized access: JWT token not provided" });
        }
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = decoded;

            const user = await userService.getRole(req.user.id);

        if (user && user.Role === 'Admin') {
            return next();
        } else {
            return res.status(403).json({statuscode: 403, result:"Access denied. You must be an admin"});
            }
        } catch (err) {
            return res.status(500).json({statuscode: 500, result: "JWT token is invalid"})
        }
    },
    isAuth: function(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) {
            return res.status(401).json({ statuscode: 401, result: "Unathorized access: JWT token not provided" });
        }
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = decoded; 
            next();
        } catch (err) {
            return res.status(500).json({statuscode: 500, result: "JWT token is invalid"})
        }
    }
}