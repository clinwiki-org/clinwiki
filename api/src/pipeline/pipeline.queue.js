import logger from '../util/logger';
import {query} from '../util/db';
import {reindexWikiPage} from './jobs/reindex.job';
import {aactStudyReindex} from './jobs/aact.job';
import {initMonitorTriggers} from './trigger.monitor';
const util = require('util')

const POLL_QUERY = 'select * from pipeline_queue order by created_at asc';
const CREATE_PIPELINE_QUEUE_TABLE = 'create table pipeline_queue (id serial primary key, created_at timestamp DEFAULT CURRENT_TIMESTAMP, job_type text, payload text)';
const DEQUEUE_JOB_QUERY = 'delete from pipeline_queue where id=$1';
const ENQUEUE_JOB_QUERY = 'insert into pipeline_queue (job_type,payload) values ($1,$2)';
export const JOB_TYPES = {
    AACT_STUDY_REINDEX: 'AACT_STUDY_REINDEX',
    AACT_CONDITIONS_REINDEX: 'AACT_CONDITIONS_REINDEX',
    WIKI_TEXT_REINDIX_2ND_PASS: 'WIKI_TEXT_REINDIX_2ND_PASS',
    WIKI_TEXT_REINDEX: 'WIKI_TEXT_REINDEX',
    WIKI_PAGE_EDIT_REINDEX: 'WIKI_PAGE_EDIT_REINDEX'
};

export const initQueue = async () => {
    // Check to see if the table exists
    try {
        let results = await query(POLL_QUERY,[]);
    }
    catch (err) {
        logger.error("BZZZT PIPELINE_QUEUE table doesn't exist. Creating it...");
        await createQueueTable();
    }
    await initMonitorTriggers();
}

const createQueueTable = async () => {
    let results = await query(CREATE_PIPELINE_QUEUE_TABLE,[]);
}

export const serveQueue = async () => {
    //logger.info('Serving pipeline queue');
    let results = await query(POLL_QUERY,[]);
    
        for(let i=0;i<results.rowCount;i++) {
            await runJob(results.rows[i]);
        }

    //logger.info('Pipeline queue done');
}

const runJob = async (job) => {
    logger.debug('Running job '+job.id);
    try {
        switch(job.job_type) {
            case JOB_TYPES.AACT_STUDY_REINDEX:
                await aactStudyReindex(JSON.parse(job.payload));
                break;
            case JOB_TYPES.WIKI_TEXT_REINDEX:
                await reindexWikiPage(JSON.parse(job.payload));
                break;
            case JOB_TYPES.WIKI_PAGE_EDIT_REINDEX:
                break;
            default:
                logger.error('Unknown job type: '+job.job_type);
        }
        logger.debug('Job finished. Removing from queue.')
        await query(DEQUEUE_JOB_QUERY,[job.id]);    
    }
    catch(err) {
        logger.error(err);
    }
}

export const enqueueJob = async (jobType,json) => {
    try {
        let results = await query(ENQUEUE_JOB_QUERY,[jobType,JSON.stringify(json)]);
    }
    catch(err) {
        logger.error('Error enqueueing job '+jobType+' '+util.inspect(json,false,null,true));
        logger.error(err);
    }
}
