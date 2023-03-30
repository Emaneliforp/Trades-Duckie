const { Schema, model } = require('mongoose');

const userQuest = new Schema({
    userId : {
        type: String,
        required: true,
    },
    quest: {
        type: String,
        required: true,
    },
});

module.exports = model('userQuest', userQuest);