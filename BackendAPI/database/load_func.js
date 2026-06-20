const pool = require('./db')

const platformMap = {};

async function loadPlatforms() {

    const result = await pool.query(
        `SELECT * FROM platforms`
    );

    result.rows.forEach(row => {
        platformMap[row.name] = row.platformid;
    });

    return platformMap;
}

module.exports = {loadPlatforms};

