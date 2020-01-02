
//i dont really care for the logger's placement
const logger = require('../../api/utility/logger');
const bodybuilding = require('../datascrapers/endpoints/bodybuilding');
const config = require('../config/db.json');

const { Client } = require('pg'); 
const client = new Client(config.pg); 

const fs = require('fs');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile); 


(async () => {
    try {
        logger.info(`datascraper loader starting...`); 
        switch(process.env.LOADER_FUNCTION) {
            case "1": 
            await createSchemaDefinitions(); 
            break; 
            case "2" : 
                await bodybuilding.exerciseFinderCache(); 
            break;
            default : logger.info(`datascraper LOADER_FUNCTION variable not set`); 
        }
    }catch(error) {
        logger.error(`datascraper | index | error : ${error}`);
    }
})(); 

async function createSchemaDefinitions() {
    try {
        logger.info(` | createSchemaDefinitions| initing db schema creation`);
        let dbStatement = await readFileAsync('../schema/db.sql', 'utf8');
        let tablesStatement = await readFileAsync('../schema/tables.sql', 'utf8'); 

        await client.connect(); 

        //let dbResponse = await client.query(dbStatement); 
        //logger.info(` | createSchemaDefinitions| dbResponse: ${JSON.stringify(dbResponse)}`);

        let tablesResponse =await client.query(tablesStatement); 
        logger.debug(` | createSchemaDefinitions| tablesResponse : ${JSON.stringify(tablesResponse)}`);
        await client.end();
        logger.info(` | createSchemaDefinitions| connection closed`);
    }catch(error) {
        logger.error(`datascraper | createSchemaDefinitions | error : ${error}`);
    }
}