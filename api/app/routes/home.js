const express = require('express'); 
const router = express.Router(); 

router.get('/api/healthcheck', async(req, res) => {
    try {
        await res.send({
            'utc' : new Date().toUTCString(), 
            'local' : new Date().toLocaleString()
        });
    }catch(error) { 
        log.error(`api | healthcheck | error : ${error}`); 
    }
}); 

module.exports = router; 