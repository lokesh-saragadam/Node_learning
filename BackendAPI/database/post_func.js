const { DatabaseError } = require('pg');
const { pool , prisma } = require('./db')
const log = require("../utils/logger");
const platformMap = {};

async function post_platforms(db,platforms){
    log("post_func.js","post_platforms","Request received");

    for(const elem in platforms){
        try{
        const platform = await db.Platform.upsert({
            where: {
                name: elem
            },
            update: {},
            create: {
                name: elem
            }
        });
    } catch (err) {
        console.log(err);
    }
    }
    log("post_func.js","post_platforms","Request resolved");
    return platformMap;
};
async function post_userhandles(db,user_handle,userid,platformid,rating){
    log("post_func.js","post_userhandles","Request received");

    try{
    const platforms = await prisma.platform.findMany();
    console.log(platforms);
    const result = await db.UserHandle.create({
        data:{
            userid,
            platformid,
            handle: user_handle,
            rating
        }
    });
    } catch (err) {
        console.log(err);
    }
    log("post_func.js","post_userhandles","Request resolved");

};
async function post_problems(db,platformid,unique_problems){
    log("post_func.js","post_problems","Request received");

    const problem_map = new Map();
    for (const element of unique_problems) {
        try{
            const result = await db.Problem.create({
                data:{
                    platformid,
                    problemcode:element.problemcode,
                    problemtitle:element.problemtitle,
                    difficulty:element.difficulty,
                    rating:element.rating,
                    tags:element.tags
                }
            });
            if (result.length > 0) {
                    problem_map.set(element.problemcode,result.rows[0].problemid)
                }
            } catch (err) {
                console.error("First failing problem:", element);
                console.error(err);
                throw err;    
            } 
        };

    log("post_func.js","post_problems","Request resolved");
    
    console.log(`Unique problems have been stored  Recieved ${unique_problems.length}`);
    return problem_map;
}
async function post_solved_problems(db,userid,solved_problems,problem_map){
    log("post_func.js","post_solved_problems","Request received");
    
    for (const elem of solved_problems) {
        try{
            
            const result = await db.SolvedProblem.upsert({
                where: {
                    userid_problemid: {
                        userid,
                        problemid: problem_map.get(elem.problemcode)
                    }
                },
                update: {
                    status: elem.status,
                    language: elem.language,
                    solvedat: elem.solvedat
                },
                create: {
                    userid,
                    problemid: problem_map.get(elem.problemcode),
                    status: elem.status,
                    language: elem.language,
                    solvedat: elem.solvedat
                }
            });
            
            if (result.rows.length > 0) {
            }
            } catch (err) {
                console.log(err);
            }
    };
    log("post_func.js","post_solved_problems","Request resolved");

    console.log(`The problems have been logged into the database,Recieved ${solved_problems.length}`);
}

async function postproblems(db,userid,platformid,unique_problems,solved_problems){
    log("post_func.js","postproblems","Request received");

    const problem_map = await post_problems(db,platformid,unique_problems);
    // await post_solved_problems(db,userid,solved_problems,problem_map);
    log("post_func.js","postproblems","Request resolved");
    
}

async function synced(db,userid){
    log("post_func.js","synced","Request received");

    await db.UserHandle.updateMany({
        where: {
            userid: userid,
            platformid: {
                in: [1, 2]
            }
        },
        data: {
            last_synced_at: new Date()
        }
    });
    log("post_func.js","synced","Request resolved");

}

async function postnewuser(userid,platforms,lcdata,cfdata){
    log("post_func.js","postnewuser","Request received");

    const lcusername = platforms.Leetcode;
    const cfusername = platforms.Codeforces;
    await prisma.$transaction(async (tx) => {

        if(userid === -1){
            throw new Error("User already exists");
        }
        console.log("User Id" ,userid)
        await post_platforms(tx, platforms);

        await post_userhandles(
            tx,
            lcusername,
            userid,
            1,
            lcdata.rating
        );

        await post_userhandles(
            tx,
            cfusername,
            userid,
            2,
            cfdata.rating
        );

        await postproblems(
            tx,
            userid,
            1,
            lcdata.unique_problems,
            lcdata.solved_problems
        );

        await postproblems(
            tx,
            userid,
            2,
            cfdata.unique_problems,
            cfdata.solved_problems
        );

    });
    console.error(err);
    log("post_func.js","postnewuser","Request resolved");

}


module.exports = {postnewuser};