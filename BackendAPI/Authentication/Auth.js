const express = require('express');
const pool = require('../database/db')
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const registerUser = asyncHandler(async (req,res) => {
    req_username = req.body.username;
    password = req.body.password;
    req_email = req.body.email;

    //checking if the username,email already exists
    const result = await prisma.problem.findUnique({ where: { username: req_username,email : req_email } })
    if(result.rows.length > 0){
        return res.status(400).json({"message": `Username or Email id already exists`});
    }
    else{
        const saltrounds = 10
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        await pool.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
            [username, hashedPassword, email]
        );
        res.status(400).json({"message": `Registration Successful`});
    }
}) 

const loginUser = asyncHandler(async (req,res)=>{
    email = req.body.email;
    password = req.body.password;
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]     
    );
    
    if(result.rows.length === 0){
        return res.status(400).json({"message": `Email does not exist`});
    }
    else{
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({"message": `Invalid Password `});
        }
        else{
            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );
            res.json({ token });
        }
    }
});

module.exports = { registerUser , loginUser };