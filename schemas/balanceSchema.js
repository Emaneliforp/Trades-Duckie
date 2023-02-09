const { Schema, model } = require('mongoose');

const balance = new Schema({
    userId : {
        type: String,
        unique: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
});

module.exports = model('balance', balance);