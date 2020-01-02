'use-strict;'

const fs = require('fs');
const axios = require('axios'); 
const { Client } = require('pg'); 
const jsdom = require('jsdom'); 
const { JSDOM } = jsdom;
const logger = require('../../../api/utility/logger');
const promisify = require('util').promisify;
const timeout = promisify(setTimeout); 
const writeAsync = promisify(fs.writeFile); 
const readAsync = promisify(fs.readFile); 

const { pg } = require('../../config/db.json');
const client = new Client(pg); 

const base = 'https://www.bodybuilding.com/exercises/finder/';

/*
 scrapes bodybuilding.com's exercise db 
 there's no api so we're doing it dirty...
 example final url : https://www.bodybuilding.com/exercises/finder/1/?muscleid=1
*/
module.exports.exerciseFinderCache = async () => {
    try {
        logger.info(`datascrapers | bodybuilding | exerciseFinderCache | starting cache`);

        await client.connect(); 
        for(muscle = 1; muscle <= 15; muscle++) {
            var finished = false; 
            let finder = 1;

            while(!finished) {
                let url = `${base}${finder}/?muscleid=${muscle}`;
                logger.info(`requesting : ${url}`);
                let bbReq = await axios(url); 
                let reqResults = await this.parseBodyBuildingExerciseDOM(bbReq.data); 
                logger.info(`results : ${JSON.stringify(reqResults)}`);
                if(reqResults.length !== 0) {
                    await this.insertExerciseResults(reqResults); 
                    finder ++;
                }

                if(reqResults.length === 0) {
                    finished = true;
                }

                await timeout(6000);
            }
        }
        await client.end();
    }catch(error) {
        logger.error(`datascrapers | bodybuilding | exerciseFinderCache | error : ${error}`);
    }
}

module.exports.insertExerciseResults = async(results) => {
    try { 
        let statement = 'insert into exercises ( name, muscle, equipment ) values ';
        for(var i = 0; i < results.length; i++) {
            statement += `( '${results[i].name.replace('\'', '')}', '${results[i].muscle.replace('\'', '')}', '${results[i].equipment.replace('\'', '')}' ),`; 
        }
        statement = statement.slice(0, statement.length -1); 
        statement += ';';
        logger.debug(`insert statement : ${statement}`);
        await client.query(statement); 
    }catch(error) {
        logger.error(`datascrapers | bodybuilding | insertExerciseResults | error : ${error}`);
    }
}

module.exports.parseBodyBuildingExerciseDOM =  async(data) => {
    try {

        logger.debug(`| parseBodyBuildingExerciseDOM | data.length : ${data.length}`);
        if(data.length != 0) {
            const dom = new JSDOM(data); 
            results = await this.parseDOM(dom);
            logger.debug(`results : ${JSON.stringify(results)}`);
        }
        //cache dom for analysis later... 
        await writeAsync('../cache/bb_dom.html',data);
        return results;

    }catch(error) {
        logger.error(`datascrapers | bodybuilding | exerciseFinderCache | error : ${error}`);
    }
}

module.exports.parseDOM = (dom) => {
    try {
        return new Promise((resolve, reject) => {
            try {
                let results = []; 
                let workouts = dom.window.document.querySelectorAll('.ExResult-row');        
                for(var i = 0; i < workouts.length; i++){ 
                    let name = workouts[i].querySelector('.ExHeading').querySelector('a');
                    let targeted = workouts[i].querySelector('.ExResult-muscleTargeted').querySelector('a');
                    let equipment = workouts[i].querySelector('.ExResult-equipmentType').querySelector('a');
                    logger.debug(`  | parseDOM | ${name.innerHTML.trimLeft().trimRight()}|${targeted.innerHTML.trimLeft().trimRight()}|${equipment.innerHTML.trimLeft().trimRight()}`);
                    results.push({
                        name : name.innerHTML.trimLeft().trimRight(), 
                        muscle : targeted.innerHTML.trimLeft().trimRight(), 
                        equipment : equipment.innerHTML.trimLeft().trimRight()
                    });
                }
                logger.debug(` | parseDOM | results.length : ${results.length}`);
                resolve(results); 
            }catch(error) {
                reject(error);
            }
        });
    }catch(error) {
        logger.error(`datascrapers | bodybuilding | parseDOM | error : ${error}`);
    }
}