// DROP SCHEMA public CASCADE;
 // CREATE SCHEMA public;
const log = require("../utils/logger");
const { pool , prisma } = require('../database/db');
async function reset_Database(){
    log("createTables.js","reset_Database","Request received");

    try {
        const lastUser = await prisma.User.findFirst({
        orderBy: {
            userid: 'desc'
        }
    });
    if (lastUser) {
        await prisma.User.delete({
            where: {
                userid: lastUser.userid
            }
        });
    }
    log("createTables.js","reset_Database","Request resolved");

    } catch (err){
        console.log(err);
    }
}




module.exports = {reset_Database}