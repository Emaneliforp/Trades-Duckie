const { Schema, model } = require('mongoose');

const command = new Schema({
    name : {
        type: String,
        required: true,
    },
    userId : {
        type: String,
        required: true,
    },
    usage: {
        type: Number,
        default: 0,
    },
});

module.exports = model('command', command);