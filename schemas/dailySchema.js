const { Schema, model } = require('mongoose');

const daily = new Schema({
    userId : {
        type: String,
        unique: true,
    },
    streak: {
        type: Number,
        default: 0,
    },
    lastRan: Number,
});

module.exports = model('daily', daily);