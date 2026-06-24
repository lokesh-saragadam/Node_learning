const pool = require('../database/db');
const asyncHandler = require('express-async-handler');

const stats_summary = asyncHandler(async (req, res) => {
     const result = await pool.query(
            'SELECT COUNT(*) FROM problems'
        );
        const totalcount = result.rows[0].count;

        const result_1 = await pool.query(
            `SELECT difficulty,COUNT(*)
             FROM problems
             GROUP BY difficulty`
        )

        const result_2 = await pool.query(
            `SELECT platformid,COUNT(*)
            FROM problems
            GROUP BY platformid`
        )
        
        res.send(result_2.rows);
});

module.exports = { stats_summary }