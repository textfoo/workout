'use-strict'; 
const logger = require('../../utility/logger');
module.exports = async function(req, res, next) {
    try {
        req.header("Access-Control-Allow-Origin", "*"); 
        req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        const log = { 
            time: new Date().toISOString(), 
            headers : JSON.stringify(req.headers),
            ip : req.ip,
            method : req.method, 
            url : req.url, 
            path : req.path, 
            protocol : req.protocol, 
            body : JSON.stringify(req.body)
        };
        logger.info(`incoming request : 
        ${JSON.stringify(log)}`);
        
        
    }catch(error) {
        logger.error(`middleware | log | error : ${error}`);
    }
    next(); 
}

