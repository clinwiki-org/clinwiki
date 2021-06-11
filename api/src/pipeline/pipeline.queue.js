import logger from '../util/logger';
import {query} from '../util/db';
import {reindexWikiPage} from './jobs/reindex.job';
import {aactStudyReindex} from './jobs/aact.job';
import {geocodeStudies} from './jobs/geocode.job';
import {initMonitorTriggers} from './trigger.monitor';
import {wikiPageReindex,crowdKeyReindex} from './jobs/clinwiki.job';
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
    WIKI_TEXT_BULK_REINDIX: 'WIKI_TEXT_BULK_REINDIX',
    WIKI_PAGE_EDIT_REINDEX: 'WIKI_PAGE_EDIT_REINDEX',
    CROWD_KEY_BULK_REINDEX: 'CROWD_KEY_BULK_REINDEX',
    GEOCODE_LOCATIONS: 'GEOCODE_LOCATIONS'
};
let IS_RUNNING = false;

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
    if(!IS_RUNNING) {
        IS_RUNNING = true;
        try {
            let results = await query(POLL_QUERY,[]);        
            for(let i=0;i<results.rowCount;i++) {
                await runJob(results.rows[i]);
            }
        }
        catch(err) {
            logger.error(err);
            IS_RUNNING = false;
        }
        IS_RUNNING = false;
    }

    //logger.info('Pipeline queue done');
}

const runJob = async (job) => {
    logger.debug('Running job '+job.id+' of type '+job.job_type);
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
            case JOB_TYPES.GEOCODE_LOCATIONS:
                await geocodeStudies(JSON.parse(job.payload));
                break;
            case JOB_TYPES.WIKI_TEXT_BULK_REINDIX:
                await wikiPageReindex(JSON.parse(job.payload));
                break;
            case JOB_TYPES.CROWD_KEY_BULK_REINDEX:
                await crowdKeyReindex(JSON.parse(job.payload));
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
