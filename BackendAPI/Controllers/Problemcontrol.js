//Imports
const { pool , prisma } = require('../database/db');
const asyncHandler = require('express-async-handler');

//Functions
const log = require("../utils/logger");
const { processcodeforcesdata } = require('../services/codeforces');
const { processleetcodedata } = require('../services/leetcode');
const { postnewuser } = require('../database/post_func');

const getProblems = asyncHandler( async (req, res) => {
    log("Problemcontrol.js","getProblems","Request received");
    const result = await prisma.Problem.findMany();
    log("Problemcontrol.js","getProblems","Request resolved");

    res.json(result.rows);
}); 

//@desc Save the new user data in the database.
//@req contains userid and platform usernames.
//@res needs no response but can stay the same.
const postUserData = asyncHandler(async (req, res) => {
    log("Problemcontrol.js","postUserData","Request received");

    const { userid, platforms } = req.body;
    // console.log("User id in post userData :",userid);
    const lcdata = await processleetcodedata(platforms.Leetcode);
    const cfdata = await processcodeforcesdata(platforms.Codeforces);
    
    await postnewuser(userid,platforms,lcdata,cfdata);

    log("Problemcontrol.js","postUserData","Request resolved");

    res.send("Data has been Recieved");
});

module.exports = { getProblems , postUserData };