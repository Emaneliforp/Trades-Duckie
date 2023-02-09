const { Schema, model } = require('mongoose');

const point = new Schema({
    userId : {
        type: String,
        unique: true,
    },
    points: {
        type: Number,
        default: 0,
    },
});

module.exports = model('point', point);