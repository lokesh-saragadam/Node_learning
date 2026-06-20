// All system modules
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require('fs');
const path = require('path');

//Postgresql
const pool = require('./database/db')

//functions and other imports
const {reset_Database,createTables,altertables} = require('./init/createTables')
const {processcodeforcesdata} = require('./services/codeforces')
const {postnewuser} = require('./database/post_func');
const { loadPlatforms } = require('./database/load_func')
const {processleetcodedata} = require('./services/leetcode');
const { platform } = require('os');
const app = express()

//others

app.use(cors());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));

//middleware functions
function getUsers() {
    const data = fs.readFileSync(dataPath, 'utf-8')
    return JSON.parse(data)
}

async function log(message) {
    const timestamp = new Date().toISOString();

    await fs.promises.appendFile(
        "server.log",
        `[${timestamp}] ${message}\n`
    );
}

function saveUsers(usersArray) {
    fs.writeFileSync(dataPath, JSON.stringify({users : usersArray}, null, 2))
}

//REST APIs
// using static and middleware.
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }));


//methods for adding users
app.get('/users', async(req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users'
        );

        res.json(result.rows);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
})

app.post('/users', async(req, res) => {
    try {
        const { username, platforms } = req.body;

        const lcdata = await processleetcodedata(platforms.Leetcode);
        const cfdata = await processcodeforcesdata(platforms.Codeforces);
        
        await postnewuser(username,platforms,lcdata,cfdata);

        res.send("Data has been Recieved");
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).send(`
                <h1>Username already exists</h1>
                <a href='/login.html'>Go Back</a>`);
        }

        console.log(err);
        res.status(500).send("Server Error");
    }
    
})
app.get('/stats/summary',async(req,res)=>{
    try{
        const result = await pool.query(
            'SELECT COUNT(*) FROM problems'
        );
        const totalcount = result.rows[0].count;

        const result_1 = await pool.query(
            `SELECT difficulty,COUNT(*)
             FROM problems
             GROUP BY difficulty`
        )

        const result_2 = await pool.query(
            `SELECT platformid,COUNT(*)
            FROM problems
            GROUP BY platformid`
        )
        
        res.send(result_2.rows);
    }catch(err){
        console.log(err);
    }
})
app.get('/problems',async(req,res)=>{
    try {
        const result = await pool.query(
            'SELECT * FROM problems'
        );

        res.json(result.rows);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
})

//Database Handling.
async function datastart(){
    // await reset_Database(); //empty the database.
    await createTables();   //create all the tables if they dont exist.
}
// altertables();
datastart();
 
app.listen(3000,()=>{
    console.log('app is listening....')
})