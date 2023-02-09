const { Schema, model } = require('mongoose');

const badge = new Schema({
    userId : String,
    name: String,
});

module.exports = model('badge', badge);