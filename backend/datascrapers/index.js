
//i dont really care for the logger's placement
const logger = require('../../api/utility/logger');
const bodybuilding = require('../datascrapers/endpoints/bodybuilding');

(async () => {
    try {
        logger.info(`datascraper loader starting...`); 
        switch(process.env.LOADER_FUNCTION) {
            case "1" : 
                await bodybuilding.exerciseFinderCache(); 
            break;
            default : logger.info(`datascraper LOADER_FUNCTION variable not set`); 
        }
    }catch(error) {
        logger.error(`datascraper | index | error : ${error}`);
    }
})(); 