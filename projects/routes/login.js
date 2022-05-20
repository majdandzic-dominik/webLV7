var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'),
    jwt = require("jsonwebtoken"),
    bcrypt = require("bcryptjs"); //used to manipulate POST

const config = require("../config/auth.config");

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
// user login function
const verifyUserLogin = async (username, password) => {
    try {
        const user = await mongoose.model('User').findOne({ username }).lean()
        if (!user) {
            return { status: 'error', error: 'user not found' }
        }
        if (await bcrypt.compare(password, user.password)) {
            // creating a JWT token
            token = jwt.sign({ id: user._id, username: user.username, type: 'user' }, config.secret, { expiresIn: '2h' })
            return { status: 'ok', data: token }
        }
        return { status: 'error', error: 'invalid password' }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'timed out' }
    }
}


//build the REST operations at the base for login
//this will be accessible from http://127.0.0.1:3000/login if the default route for / is left unchanged
router.route('/')
    //get the login page
    .get(function (req, res, next) {
        res.render('login', { title: 'Login' });
    })

    .post(async (req, res) => {
        const { username, password } = req.body;
        // we made a function to verify our user login
        const response = await verifyUserLogin(username, password);
        if (response.status === 'ok') {
            // storing our JWT web token as a cookie in our browser
            res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });  // maxAge: 2 hours
            res.location('projects');
            res.redirect('/projects');
        } else {
            res.json(response);
        }
    });


module.exports = router;