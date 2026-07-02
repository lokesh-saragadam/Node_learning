const asyncHandler = require('express-async-handler');
const  { pool , prisma } = require('../database/db');



//@desc Get all users
//@req has no body
//@res needs all Users out.
const getUsers = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await prisma.User.findUnique({
        where: {
            userid: id
        },
        select: {
            username: true
        }
    });
    const name = result.rows[0].username
    res.status(400).send(`Hello ${name}!`);
});

module.exports = { getUsers };