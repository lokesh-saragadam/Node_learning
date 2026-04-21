const http = require('http');

const server = http.createServer((req,res)=>{
    if(req.url === '/'){
        res.write('Welcome to our Home page')
        res.end()
    }
    if(req.url === '/about'){
        res.write('You are in our about page')
        res.end()
    }
    res.write(`
        <h1>Ooops!</h1>
        <p>we can't find the page your looking for</p>
        <a href="/">back Home</a>
        `)
    res.end()
});

server.listen(5000);