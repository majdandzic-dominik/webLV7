var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    finished_jobs: String,
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: Date.now },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isArchived: Boolean
});

mongoose.model('Project', projectSchema);