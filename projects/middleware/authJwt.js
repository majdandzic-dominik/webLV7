const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
var mongoose = require('mongoose')

verifyToken = (req, res, next) => {
    let token = req.cookies.token;
    //if no token then go back to login page
    if (!token) {
        return res.format({
            html: function () {
                res.location("login");
                res.redirect("/login");
            }
        });
    }
    //if token is not valid go back to login page
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.format({
                html: function () {
                    res.location("login");
                    res.redirect("/login");
                }
            });
        }
        req.userId = decoded.id;

        //throw error if user not found
        mongoose.model('User').findById(req.userId).exec((err, user) => {
            if (err) {
                console.log('User not found');
                res.status(500).send({ message: err });
                return res.format({
                    html: function () {
                        res.location("login");
                        res.redirect("/login");
                    }
                });;
            }
            else {
                res.locals.user = user;
                next();
            }
        });
    });
};

isLoggedIn = (req, res, next) => {
    let token = req.cookies.token;

    if (token) {
        return res.format({
            html: function () {
                res.location("projects");
                res.redirect("/projects");
            }
        });
    }
    next();
};

const authJwt = {
    verifyToken: verifyToken,
    isLoggedIn: isLoggedIn
};

module.exports = { authJwt };