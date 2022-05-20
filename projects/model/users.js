var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    projects: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }
});

mongoose.model('User', userSchema);