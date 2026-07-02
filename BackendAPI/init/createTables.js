// DROP SCHEMA public CASCADE;
 // CREATE SCHEMA public;

const { pool , prisma } = require('../database/db');
async function reset_Database(){
    try {
        const lastUser = await prisma.users.findFirst({
        orderBy: {
            userid: 'desc'
        }
    });
    if (lastUser) {
        await prisma.users.delete({
            where: {
                userid: lastUser.userid
            }
        });
    }

    } catch (err){
        console.log(err);
    }
}




module.exports = {reset_Database}