const { pool , prisma } = require('./db')

const platformMap = {};

async function loadPlatforms() {

    const result = await prisma.platforms.findMany();

    result.forEach(row => {
        platformMap[row.name] = row.platformid;
    });

    return platformMap;
}

module.exports = {loadPlatforms};

