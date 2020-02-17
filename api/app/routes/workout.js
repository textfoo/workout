const express = require('express'); 
const router = express.Router(); 
const logger = require('../../utility/logger')

router.post('/api/workout', async(req, res) => {
    try {
        logger.info(`/api/workout | ${JSON.stringify(req.body)}`); 
        //in here we need to check if the workrout exists 
        await res.send({    
            
        });
    }catch(error) { 
        log.error(`api | workout | error : ${error}`); 
    }
}); 