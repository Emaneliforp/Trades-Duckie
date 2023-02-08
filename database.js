const chalk = require('chalk');
const database = require('mongoose');
const config = require('./config.json');

database.connect(config.MONGO_UR);
database.connection.on('connected', () => {
	process.stdout.write(`[${chalk.greenBright('BOOT')}] Connected to MongoDB!\n`);
});
database.connection.on('err', (err) => {
	process.stdout.write(`[${chalk.redBright('ERROR')}] Unable to connect to the MongoDB:\n${err}\n`);
});
database.connection.on('disconnected', () => {
	process.stdout.write(`[${chalk.blueBright('INFO')}] MongoDB connection is disconnected\n`);
});