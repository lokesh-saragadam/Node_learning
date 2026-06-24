const pool = require('../database/db');
const asyncHandler = require('express-async-handler');

const getProblems = asyncHandler( async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM problems'
    );
    res.json(result.rows);
}); 

module.exports = {getProblems};