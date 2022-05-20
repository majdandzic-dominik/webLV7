var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    bcrypt = require("bcryptjs");
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

//build the REST operations at the base for register
//this will be accessible from http://127.0.0.1:3000/register if the default route for / is left unchanged
router.route('/')
    //get the register page
    .get(function (req, res, next) {
        res.render('register', { title: 'Registration' });
    })

    //create new user
    .post(function (req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var username = req.body.username;
        var password = bcrypt.hashSync(req.body.password);

        //call the create function for our database
        mongoose.model('User').create({
            username: username,
            password: password
        }, function (err, project) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //user has been created
                console.log('POST creating new user: ' + project);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function () {
                        res.location("login");
                        res.redirect("/login");
                    }
                });
            }
        })
    });
module.exports = router;