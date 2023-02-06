const { client } = require('../index.js');

module.exports = class Utils {
    static async getData(path) {
        let data;
        await client.DB.ref(path)
            .once('value')
            .catch(e => client.utils.error(client, path, 'getData', e))
            .then(snapshot => {
                if (snapshot)
                    data = snapshot.val();
            });
        return data;
    }
    static setData(path, data) {
        client.DB.ref(path)
            .set(data)
            .catch(e => client.utils.error(client, path, 'setData', e));
    }
    static removeData(path) {
        client.DB.ref(path)
            .remove()
            .catch(e => client.utils.error(client, path, 'removeData', e));
    }
};
