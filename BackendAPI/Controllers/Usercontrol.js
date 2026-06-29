const asyncHandler = require('express-async-handler');
const pool = require('../database/db');

//@desc Get all users
//@req has no body
//@res needs all Users out.
const getUsers = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await pool.query(`
        SELECT username FROM users
        WHERE userid = $1`,
        [id]
    );
    const name = result.rows[0].username
    res.status(400).send(`Hello ${name}!`);
});

module.exports = { getUsers };