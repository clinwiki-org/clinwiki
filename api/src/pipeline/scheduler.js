import schedule from 'node-schedule';
import config from '../../config';
import aactJob from './jobs/aact.job';
import scheduledDocJob from './jobs/indexDoc.job'
import clinwikiJob from './jobs/clinwiki.job';
import {serveQueue} from './pipeline.queue';
import logger from '../util/logger';

const util = require('util')

const INTERVAL = 5 * 1000;
 
export const runScheduler =  () => {
    logger.info("In scheduler")
    schedule.scheduleJob( config.aactCronTab,function(fireDate){
        logger.info('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
        scheduledDocJob();
    });
    setInterval(serveQueue, INTERVAL);
    
}

