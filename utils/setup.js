const { botInvite, guildInvite } = require('../config.json');
module.exports = class Setup {
    static async init(client) {
        client.DB = require('../firebase').DB;
        client.db = require('./db');
        client.utils = require('./utils');
        client.fetch = require('./fetch');
        client.embed = require('./embed');
        client.botInvite = botInvite;
        client.guildInvite = guildInvite;

        client.tp = { perm: {} };
        await client.setup.getTp(client);
        return client;
    }
    static async getTp(client) {
        client.tp.perm = await client.db.getData('tpPerm/');
    }
};