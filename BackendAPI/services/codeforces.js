const axios = require('axios')
const fs = require('fs')


async function getUsers_1(handle){
    try {
    const res = await axios.get(
        `https://codeforces.com/api/user.status?handle=${handle}`,{
            timeout:5000 //5 secs timeout,
        }
    );
    return res.data.result;
    } catch (err){
        console.log(err)
    };
}
async function getUserInfo(handle) {
    try {
        const res = await axios.get(
            `https://codeforces.com/api/user.info?handles=${handle}`
        );

        const user = res.data.result[0];

        return user;

    } catch (err) {
        console.log(err);
    }
}

async function getUniquesolved_problems(submissions){
    const accepted = submissions.filter(
    sub => sub.verdict === "OK"
    );

    // console.log(`Number of submissions recieved ${submissions.length}`);
    // console.log(`Number of accepted problems are ${accepted.length}`);

    const solved_problems = [];
    const unique_problems = [];
    const seen = new Set();
    accepted.forEach(sub => {
        const prblmid = `${sub.problem.contestId}-${sub.problem.index}`
        if(!seen.has(prblmid)){
            seen.add(prblmid);

            solved_problems.push(
                {
                    problemid: prblmid,
                    status: sub.verdict,
                    solvedat: new Date(sub.creationTimeSeconds * 1000),
                    language: sub.programmingLanguage
                }
            );
    }
    });

    seen.clear();

    submissions.forEach(sub=>{
        const prblmid = `${sub.problem.contestId}-${sub.problem.index}`
        if(!seen.has(prblmid)){
            seen.add(prblmid);
            
            unique_problems.push(
                {
                    problemcode: prblmid,
                    problemtitle: sub.problem.name,
                    difficulty : sub.problem.rating,
                    tags : sub.problem.tags
                }
            );
        };
    })

    return {solved_problems,unique_problems};
}

async function processcodeforcesdata(cfhandle){

    const submissions = await getUsers_1(cfhandle); //to save for problems.
    const user_info = await getUserInfo(cfhandle); //for user rating
    const rating = user_info.rating;
    // to post them into databases.
    const {solved_problems,unique_problems} = await getUniquesolved_problems(submissions);
    return {rating,solved_problems,unique_problems};
}
async function main(){
    const rawData = fs.readFileSync('Submissions_data.json','utf-8');
    const Submission_Data = JSON.parse(rawData);

    const accepted = Submission_Data.filter(
    sub => sub.verdict === "OK"
    );

    const wrong = Submission_Data.filter(
        sub=>sub.verdict === "WRONG_ANSWER"
    );

    const solved = new Set();

    accepted.forEach(sub => {
        solved.add(
            `${sub.problem.contestId}-${sub.problem.index}`
        )
    });

    const acceptedjson = JSON.stringify(accepted,null,2);
    fs.writeFile('accepted.json',acceptedjson,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Now Stored all the unique accepted problems")
        }
    });

    console.log(`The Number of problems solved by the user which got accepted are : ${solved.size}`);

};

module.exports = {processcodeforcesdata};