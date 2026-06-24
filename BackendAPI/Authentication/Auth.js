const express = require('express');
const pool = require('../database/db')
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req,res) => {
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
}) 

const loginUser = asyncHandler(async (req,res)=>{
    email = req.body.email;
    password = req.body.password;

    const result = await pool.query(
        'SELECT * FROM registerusers WHERE email = $1',
        [email]     
    );
    
    if(result.rows.length === 0){
        return res.status(400).send(`
            <h1>Email does not exist</h1>
            <a href='/login.html'>Go Back</a>`);
    }
    else{
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).send(`
                <h1>Invalid Password</h1>
                <a href='/login.html'>Go Back</a>`);
        }
        else{
            res.send(`
                <h1>Login Successful</h1>
                <p>Welcome, ${user.username}!</p>
            `);
        }
    }
});

module.exports = { registerUser , loginUser };