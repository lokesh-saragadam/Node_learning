const { DatabaseError } = require('pg');
const { pool , prisma } = require('./db')

const platformMap = {};

async function post_platforms(db,platforms){
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
    return platformMap;
};
async function post_userhandles(db,user_handle,userid,platformid,rating){
    try{
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
};
async function post_problems(db,platformid,unique_problems){
    const problem_map = new Map();
    for (const element of unique_problems) {
        try{
            const result = await db.Problem.create({
                data:{
                    platformid,
                    problemcode:element.problemcode,
                    problemtitle:element.problemtitle,
                    difficulty:element.difficulty,
                    tags:element.tags
                }
            });
            if (result.length > 0) {
                    problem_map.set(element.problemcode,result.rows[0].problemid)
                }
            } catch (err) {
                console.log(err);
            } 
        };
    
    console.log(`Unique problems have been stored  Recieved ${unique_problems.length}`);
    return problem_map;
}
async function post_solved_problems(db,userid,solved_problems,problem_map){
    
    for (const elem of solved_problems) {
        try{
            const result = await db.SolvedProblem.upsert({
                where: {
                    userid_problemid: {
                        userid,
                        problemid: problem_map.get(elem.problemid)
                    }
                },
                update: {
                    status: elem.status,
                    language: elem.language,
                    solvedat: elem.solvedat
                },
                create: {
                    userid,
                    problemid: problem_map.get(elem.problemid),
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

    console.log(`The problems have been logged into the database,Recieved ${solved_problems.length}`);
}

async function postproblems(db,userid,platformid,unique_problems,solved_problems){
    const problem_map = await post_problems(db,platformid,unique_problems);
    await post_solved_problems(db,userid,solved_problems,problem_map);
}

async function synced(db,userid){
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
}

async function postnewuser(userid,platforms,lcdata,cfdata){

    await prisma.$transaction(async (tx) => {

        if(userid === -1){
            throw new Error("User already exists");
        }

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
}


module.exports = {postnewuser};