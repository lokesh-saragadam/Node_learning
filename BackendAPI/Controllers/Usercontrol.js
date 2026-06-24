const asyncHandler = require('express-async-handler');
const pool = require('../database/db');
const { processcodeforcesdata } = require('../services/codeforces');
const { processleetcodedata } = require('../services/leetcode');
const { postnewuser } = require('../database/post_func');

//@desc Get all users
//@req has no body
//@res needs all Users out.
const getUsers = asyncHandler(async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
});

//@desc Save the new user data in the database.
//@req contains username and platform usernames.
//@res needs no response but can stay the same.
const saveUsers = asyncHandler(async (req, res) => {
    const { username, platforms } = req.body;

    const lcdata = await processleetcodedata(platforms.Leetcode);
    const cfdata = await processcodeforcesdata(platforms.Codeforces);
    
    await postnewuser(username,platforms,lcdata,cfdata);

    res.send("Data has been Recieved");
});

module.exports = { getUsers, saveUsers };