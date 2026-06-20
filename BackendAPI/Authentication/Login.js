const express = require('express');
const pool = require('../database/db')
const bcrypt = require('bcrypt');

const {createTables, reset_Database} = require('../init/createTables');
app = express();

app.use(express.static('../public'))
app.use(express.urlencoded({ extended: true }));

createTables();

app.listen(3001,()=>{
    console.log("Server is running on port 3001");
});

app.post('/Register',async(req,res)=>{
    try{
        username = req.body.username;
        password = req.body.password;
        email = req.body.email;

        //checking if the username,email already exists
        const result = await pool.query(
            'SELECT * FROM registerusers WHERE username = $1 OR email = $2',
            [username, email]
        );
        if(result.rows.length > 0){
            return res.status(400).send(`
                <h1>Username or Email already exists</h1>
                <a href='/register.html'>Go Back</a>`);
        }
        else{
            const saltrounds = 10
            const hashedPassword = await bcrypt.hash(password, saltrounds);
            await pool.query(
                'INSERT INTO registerusers (username, password, email) VALUES ($1, $2, $3)',
                [username, hashedPassword, email]
            );
            res.send(`
                <h1>Registration Successful</h1>
                <a href='/login.html'>Go to Login</a>`);
        }

    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
});

