// DROP SCHEMA public CASCADE;
 // CREATE SCHEMA public;

const pool = require('../database/db');
async function reset_Database(){
    try {
        await pool.query(`
            DROP SCHEMA public CASCADE;
            CREATE SCHEMA public;
            `);
    } catch (err){
        console.log(err);
    }
}

async function createTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS registerusers (
                userid SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE,
                password VARCHAR(100),
                email VARCHAR(100) UNIQUE
            );
            CREATE TABLE IF NOT EXISTS users (
                userid SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE
            );

            CREATE TABLE IF NOT EXISTS platforms (
                platformid SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE
            );
            
            CREATE TABLE IF NOT EXISTS user_handles (
                handleid SERIAL PRIMARY KEY,
                userid INT REFERENCES users(userid),
                platformid INT REFERENCES platforms(platformid),
                handle VARCHAR(100) UNIQUE,
                rating INT,
                UNIQUE (userid,platformid)
            );

            CREATE TABLE IF NOT EXISTS problems (
                problemid SERIAL PRIMARY KEY,
                platformid INT REFERENCES platforms(platformid),
                problemcode VARCHAR(100) UNIQUE,
                problemtitle VARCHAR(100),
                difficulty VARCHAR(20),
                tags TEXT[],
                UNIQUE (platformid,problemcode)
            );

            CREATE TABLE IF NOT EXISTS solved_problems (
                solvedid SERIAL PRIMARY KEY,
                userid INT REFERENCES users(userid),
                problemid INT REFERENCES problems(problemid),
                status VARCHAR(30),
                language VARCHAR(50),
                solvedat TIMESTAMP,
                UNIQUE (userid,problemid)
            )
            
        `);

        console.log("Tables are ready");

    } catch (err) {
        console.log(err);
    }
};

async function altertables(){
    try{
        await pool.query(`
        ALTER TABLE user_handles
        ADD COLUMN last_synced_at TIMESTAMP;
        `);
    } catch(err){
        console.log(err);
    }
}
module.exports = {reset_Database,createTables,altertables}