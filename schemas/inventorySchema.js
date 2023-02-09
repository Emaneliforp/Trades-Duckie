const { Schema, model } = require('mongoose');

const inventory = new Schema({
    userId : String,
    name: String,
    quantity: Number,
});

module.exports = model('inventory', inventory);