const { DatabaseError } = require('pg');
const pool = require('./db')

const platformMap = {};

async function post_platforms(platforms){
    for(const elem in platforms){
        try{
        const result = await pool.query(
            `INSERT INTO platforms(name)
             VALUES($1)
             ON CONFLICT DO NOTHING
             RETURNING *`,
            [elem]
        );
    } catch (err) {
        console.log(err);
    }
    }
    return platformMap;
};
async function post_userhandles(user_handle,userid,platformid,rating){
    try{
    const result = await pool.query(
            `INSERT INTO user_handles(userid, platformid, handle, rating)
             VALUES($1, $2, $3, $4)
             RETURNING *`,
            [userid, platformid, user_handle, rating]
        );
    } catch (err) {
        console.log(err);
    }
};
async function post_problems(platformid,unique_problems){
    const problem_map = new Map();
    for (const element of unique_problems) {
        try{
            const result = await pool.query(
                    `INSERT INTO problems(platformid, problemcode, problemtitle, difficulty, tags)
                    VALUES($1, $2, $3, $4, $5)
                    ON CONFLICT(problemcode) DO NOTHING
                    RETURNING *`,
                    [platformid,element.problemcode, element.problemtitle, element.difficulty, element.tags]
                );
                if (result.rows.length > 0) {

                    problem_map.set(element.problemcode,result.rows[0].problemid)
                }
            } catch (err) {
                console.log(err);
            } 
        };
    
    console.log(`Unique problems have been stored  Recieved ${unique_problems.length}`);
    return problem_map;
}
async function post_solved_problems(userid,solved_problems,problem_map){
    
    for (const elem of solved_problems) {
        try{
            const result = await pool.query(
                    `INSERT INTO solved_problems(userid, problemid, status, language, solvedat)
                    VALUES($1, $2, $3, $4, $5)
                    ON CONFLICT(userid, problemid) DO UPDATE SET
                    status = EXCLUDED.status,
                    language = EXCLUDED.language,
                    solvedat = EXCLUDED.solvedat
                    RETURNING *`,
                    [userid,problem_map.get(elem.problemid), elem.status, elem.language, elem.solvedat]
                );
                if (result.rows.length > 0) {
            }
            } catch (err) {
                console.log(err);
            }
    };

    console.log(`The problems have been logged into the database,Recieved ${solved_problems.length}`);
}

async function postproblems(userid,platformid,unique_problems,solved_problems){
    const problem_map = await post_problems(platformid,unique_problems);
    await post_solved_problems(userid,solved_problems,problem_map);
}

async function synced(userid){
    await pool.query(`
        UPDATE user_handles
        SET last_synced_at = NOW()
        WHERE userid = $1
        AND platformid ANY $2;
        `,
        [userid,[1,2]]
    )
}

async function postnewuser(userid,platforms,lcdata,cfdata){

    await pool.query("BEGIN");

    try {

        console.log("userid =", userid, typeof userid);
        if(userid === -1){
            await pool.query("ROLLBACK");
            throw new Error("User already exists");
        }
        await post_platforms(platforms);

        const cfusername = platforms.Codeforces; //username for primary key.
        const lcusername = platforms.Leetcode;  //username for LC

        await post_userhandles(lcusername,userid,1,lcdata.rating);
        await post_userhandles(cfusername,userid,2,cfdata.rating);

        await postproblems(userid,1,lcdata.unique_problems,lcdata.solved_problems);
        await postproblems(userid,2,cfdata.unique_problems,cfdata.solved_problems);
        
        // await synced(userid);
        await pool.query("COMMIT");
    } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
}
}

module.exports = {postnewuser};