const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Myapp1',
    password: 'IITHch@2615',
    port: 5432,
});

module.exports = pool
