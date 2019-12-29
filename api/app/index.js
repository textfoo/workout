const express = require('express');
const fs = require('fs'); 
const app = express(); 
const https = require('https'); 

app.use(require('body-parser').json()); 
app.use(require('./middleware/request-log'));
app.use(require('./routes/home'));

let _key = fs.readFileSync('./certs/server.key', 'utf8'); 
let _cert = fs.readFileSync('./certs/server.cert', 'utf8'); 

const server = https.createServer({
    key : _key,
    cert : _cert
}, app);

server.listen(8083, () => {
    console.log(`server running on 8083`);
});
