import schedule from 'node-schedule';
import config from '../../config';
import aactJob from './jobs/aact.job';
import clinwikiJob from './jobs/clinwiki.job';
import reindexJob from './jobs/reindex.job';
const util = require('util')

const INTERVAL = 10 * 1000;
 
export const runScheduler = () => {
    schedule.scheduleJob(config.clinwikiCronTab, clinwikiJob);
    //schedule.scheduleJob(config.aactCronTab, aactJob);
    //setInterval(reindexJob, INTERVAL);
    
}

