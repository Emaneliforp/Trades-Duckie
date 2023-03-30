const { Schema, model } = require('mongoose');

const quest = {
    quest: String,
};

const questConfig = new Schema({
    weekly : {
        type: [quest],
    },
    daily: {
        type: [quest],
    },
});

module.exports = model('questConfig', questConfig);