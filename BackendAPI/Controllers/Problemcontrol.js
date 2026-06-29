//Imports
const pool = require('../database/db');
const asyncHandler = require('express-async-handler');

//Functions
const { processcodeforcesdata } = require('../services/codeforces');
const { processleetcodedata } = require('../services/leetcode');
const { postnewuser } = require('../database/post_func');

const getProblems = asyncHandler( async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM problems'
    );
    res.json(result.rows);
}); 

//@desc Save the new user data in the database.
//@req contains userid and platform usernames.
//@res needs no response but can stay the same.
const postUserData = asyncHandler(async (req, res) => {
    const { userid, platforms } = req.body;

    const lcdata = await processleetcodedata(platforms.Leetcode);
    const cfdata = await processcodeforcesdata(platforms.Codeforces);
    
    await postnewuser(userid,platforms,lcdata,cfdata);

    res.send("Data has been Recieved");
});

module.exports = { getProblems , postUserData };