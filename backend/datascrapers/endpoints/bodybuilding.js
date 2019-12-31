'use-strict;'

const fs = require('fs');
const axios = require('axios'); 
const jsdom = require('jsdom'); 
const { JSDOM } = jsdom;
const logger = require('../../../api/utility/logger');
const promisify = require('util').promisify;
const timeout = promisify(setTimeout); 
const writeAsync = promisify(fs.writeFile); 
const readAsync = promisify(fs.readFile); 

const base = 'https://www.bodybuilding.com/exercises/finder/';

/*
 scrapes bodybuilding.com's exercise db 
 there's no api so we're doing it dirty...
 example final url : https://www.bodybuilding.com/exercises/finder/1/?muscleid=1
*/
module.exports.exerciseFinderCache = async () => {
    try {
        logger.info(`datascrapers | bodybuilding | exerciseFinderCache | starting cache`);
        await this.parseBodyBuildingExerciseDOM('');
        //uncomment to go live
        /*
        for(muscle = 1; muscle <= 15; muscle++) {
            var finished = false; 
            let finder = 1; 
            while(!finished) {
                let url = `${base}${finder}/?muscleid=${muscle}`;
                logger.info(`requesting : ${url}`);
                let bbReq = await axios(url); 
                let reqResults = await this.parseBodyBuildingExerciseDOM(bbReq.data); 

                finder ++;
                await timeout(3000);
                //figure out how to get a signal back to tell if the scraper is finished
                if(finder >= 11) {
                    finished = true;
                }
            }
        }
        */

    }catch(error) {
        logger.error(`datascrapers | bodybuilding | exerciseFinderCache | error : ${error}`);
    }
}

module.exports.parseBodyBuildingExerciseDOM =  async(data) => {
    try {
        let results = []; 
        logger.debug(`| parseBodyBuildingExerciseDOM | data.length : ${data.length}`);
        //easy entry point for debugging and writing the parser
        if(data.length == 0) {
            logger.debug(`data file unspecified - reading from cache`); 
            data = await readAsync('../cache/bb_dom.html', 'utf8'); 
            logger.debug(`cache length : ${data.length}`);
            const dom = new JSDOM(data); 
            let workouts = dom.window.document.querySelectorAll('.ExResult-row');
            console.log(`workouts length : ${workouts.length}`);
            
            for(var i = 0; i < workouts.length; i++){ 
                let name = workouts[i].querySelector('.ExHeading').querySelector('a');
                let targeted = workouts[i].querySelector('.ExResult-muscleTargeted').querySelector('a');
                let equipment = workouts[i].querySelector('.ExResult-equipmentType').querySelector('a');
                //logger.debug(`${heading.innerHTML}|${targeted.innerHTML}|${equipment.innerHTML}`);
                results.push({
                    name : name.innerHTML.trimLeft().trimRight(), 
                    muscle : targeted.innerHTML.trimLeft().trimRight(), 
                    equipment : equipment.innerHTML.trimLeft().trimRight()
                });
            }
            logger.debug(`results : ${JSON.stringify(results)}`);
        }
        //cache dom for analysis later... 
        await writeAsync('../cache/bb_dom.html',data);

    }catch(error) {
        logger.error(`datascrapers | bodybuilding | exerciseFinderCache | error : ${error}`);
    }
}