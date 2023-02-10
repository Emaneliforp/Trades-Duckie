const { Schema, model } = require('mongoose');

const inventory = new Schema({
    userId : String,
    name: String,
    quantity: {
        type: Number,
        default: 0,
    },
});

module.exports = model('inventory', inventory);