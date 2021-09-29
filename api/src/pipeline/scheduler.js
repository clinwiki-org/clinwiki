import schedule from 'node-schedule';
import config from '../../config';
import aactJob from './jobs/aact.job';
import scheduledDocJob from './jobs/indexDoc.job'
import clinwikiJob from './jobs/clinwiki.job';
import {serveQueue} from './pipeline.queue';

const util = require('util')

const INTERVAL = 5 * 1000;
 
export const runScheduler = () => {
    schedule.scheduleJob(config.aactCronTab, scheduledDocJob);
    setInterval(serveQueue, INTERVAL);
    
}

