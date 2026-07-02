const { pool , prisma } = require('../database/db');
const asyncHandler = require('express-async-handler');

const stats_summary = asyncHandler(async (req, res) => {
     const result = await prisma.Problem.count();
        const totalcount = result.rows[0].count;

        const result_1 =  await prisma.Problem.groupBy({
            by: ['difficulty'],
            _count: {
                _all: true
            }
        });

        const result_2 = await prisma.Problem.groupBy({
            by: ['platformid'],
            _count: {
                _all: true
            }
        });
        
        res.send(result_2.rows);
});

module.exports = { stats_summary }