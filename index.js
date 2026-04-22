const express = require('express');
const app = express();
app.use(express.json());
const {readFile,writeFile} = require('fs')

readFile('./content/first.txt','utf8',(err,result)=>{
    if(err){
        console.log(err)
        return
    }
    const first = result;
    readFile('./content/second.txt','utf8',(err,result)=>{
        if(err){
            console.log(err)
            return
        }
        const second = result;
        writeFile(
            './content/subfolder/text.txt',
            `Combinig both file text,${first} ,${second} `,
            (err,result)=>{
                if(err){
                    console.log(err)
                    return
                }
                console.log(result)
            }
        )
    })
})

let users=[];
let id=2;

//create user
app.post("/users",(req,res)=>{
    const user = {
        id: id++,
        name: req.body.name,
        platforms: req.body.platforms
    };
    users.push(user);
    res.json(user);
});

//get all users
app.get("/users",(req,res)=>{
    res.json(users);
});

// get user by id
app.get("/users/:id",(req,res)=>{
    const user = users.find(u=> u.id == req.params.id);
    res.json(user);
});


// app.listen(
//     3000,
//     ()=>console.log("server running on port 3000")
// )


// app.get('/tshirt',(req,res)=>{
//     res.status(200).send({
//         tshirt:'H',
//         size:'large'
//     })

// });

// app.post('/tshirt/:id',(req,res)=>{
//     const { id } = req.params;
//     const { logo } = req.body;

//     if(!logo){
//         res.status(418).send({message:'We need a logo!'})
//     }

//     res.send({
//         tshirt:`H with your ${logo} and ID of ${ id } `
//     })
// });