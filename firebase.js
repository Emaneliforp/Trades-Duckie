const { apiKey, projectID, URL } = require('./config.json');
const firebase = require('firebase');
require('firebase/database');

firebase.initializeApp({
    apiKey: apiKey,
    projectId: projectID,
    databaseURL: URL,
});

module.exports = {
    DB: firebase.database(),
};