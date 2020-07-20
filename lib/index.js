const { ArrowClient } = require('./client');

const runQuery = (client, statement, params) => new Promise((resolve, reject) => {
    client.query(statement, params, (err, rows) => {
        if (err) {
            reject(err);
            return;
        }

        resolve(rows);
    });
});

const pg2arrow = async (...args) => {
    // eslint-disable-next-line one-var
    const config = args[0];

    let connectionString;
    let query;
    let params;
    if (typeof config === 'object') {
        connectionString = config.connectionString;
        query = config.query;
        params = config.params;
    } else {
        [query, params] = args;
    }

    const client = new ArrowClient();
    client.connectSync(connectionString);
    try {
        const arrow = await runQuery(client, query, params);
        return arrow.serialize().buffer;
    } finally {
        client.end();
    }
};

module.exports = pg2arrow;
module.exports.ArrowClient = ArrowClient;
