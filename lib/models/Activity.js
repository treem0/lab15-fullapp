const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    userId: String
});

module.exports = mongoose.model('Activity', schema);