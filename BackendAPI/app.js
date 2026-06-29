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
const {router} = require('./Routes/router');

const { platform } = require('os');
const app = express()

//others

app.use(cors());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));


//REST APIs
// using static and middleware.
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }));


//methods for adding users
app.use('/api', router);

//Database Handling.
async function datastart(){
    // await reset_Database(); //empty the database.
    // await createTables();   //create all the tables if they dont exist.
}
// altertables();
datastart();
 
app.listen(3000,()=>{
    console.log('app is listening....')
})