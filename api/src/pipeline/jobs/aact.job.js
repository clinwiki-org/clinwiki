import logger from '../../util/logger';
import {queryAACT} from '../../util/db';
import {bulkUpsert,bulkUpdate} from '../../search/elastic';
import {JOB_TYPES,enqueueJob} from '../pipeline.queue';
import {clinwikiJob} from './clinwiki.job';
import moment from 'moment';
const util = require('util')

const STUDIES_TO_INDEX_QUERY = "select nct_id from studies where updated_at > localtimestamp - INTERVAL '1 day'";
const REINDEX_ALL_QUERY = "select nct_id from studies";
const REINDEX_STUDY_QUERY = "select nct_id from studies where nct_id=$1";
const CHUNK_SIZE = 1000;

let IS_RUNNING = false;

const aactJob = async () => {
    try {
        if(!IS_RUNNING) {
            IS_RUNNING = true;
            logger.info('Starting AACT Job');

            const studyIds = await getStudiesToIndex();
            logger.debug("Number of studies to index: "+studyIds.length);
            const bulkList = chunkList(studyIds,CHUNK_SIZE);

            for(let j=0;j<bulkList.length;j++) {
                const idList = bulkList[j];
                // Queue these up for reindexing
                await enqueueJob(JOB_TYPES.AACT_STUDY_REINDEX,{studies: idList});     
                // Now queue up reindex of clinwiki
                await clinwikiJob(idList);           
            }

            logger.info('Job AACT Finished.')
            IS_RUNNING = false;
        }
    }
    catch(err) {
        logger.error(err);
        IS_RUNNING = false;
    }
};

export const aactStudyReindex = async (payload) => {
    const idList = payload.studies;

    const results = await getBulkStudies(idList);
    //  console.log(util.inspect(results, false, null, true))
                
    let studies = [];
    for(let i=0;i<results.rowCount;i++) {
        let study = results.rows[i];
        let currentTime = Date.now();
        let formattedTime = moment(currentTime).format('YYYY-MM-DD');
        study.indexed_at = formattedTime
        studies.push(study);
    }
    logger.info("Sending bulk update of "+idList.length);
    // console.log(util.inspect(studies, false, null, true ))
    let response = await bulkUpsert(studies);
    // console.log("-------------------");
    // console.log("Bulk Upsert Response")
    // console.log(util.inspect(response, false, null, true));
    await sendBriefSummaries(idList);
    await sendConditions(idList);
    await enqueueJob(JOB_TYPES.GEOCODE_LOCATIONS,{studies: idList});
    logger.info("Bulk update complete.");

}

const getStudiesToIndex = async () => {
    const rs = await queryAACT(STUDIES_TO_INDEX_QUERY,[]);
    return rs.rows.map( row => row.nct_id);
};

const getAllStudiesToIndex = async () => {
    const rs = await queryAACT(REINDEX_ALL_QUERY,[]);
    return rs.rows.map( row => row.nct_id);
};

const getSingleStudyToIndex = async (nctId) => {
    const rs = await queryAACT(REINDEX_STUDY_QUERY,[nctId]);
    console.log(">>>>>>>>>>>>>>>>>>");
    // console.log(util.inspect(rs, false, null,true));
    return rs.rows.map( row => row.nct_id);
};


const getBulkStudies = async (idList) => {
    let params = idList.map( (id,index) => '$'+(index+1));
    const query = 'select * from studies where nct_id in ('+params.join(',')+')';
    const rs = await queryAACT(query,idList);
    return rs;
}

const sendBriefSummaries = async (idList) => {
    let params = idList.map( (id,index) => '$'+(index+1));
    const query = 'select * from brief_summaries where nct_id in ('+params.join(',')+')';
    const results = await queryAACT(query,idList);
    
    let studies = [];
    for(let i=0;i<results.rowCount;i++) {
        const summary = results.rows[i];
        const study = {
            nct_id: summary.nct_id,
            brief_summary: summary.description
        };
        studies.push(study);
    }
    await bulkUpdate(studies);
}

const sendConditions = async (idList) => {
    let params = idList.map( (id,index) => '$'+(index+1));
    const query = 'select nct_id,array_agg(downcase_name) condi from conditions where nct_id in ('+params.join(',')+') group by nct_id';
    const results = await queryAACT(query,idList);
    
    let studies = [];
    for(let i=0;i<results.rowCount;i++) {
        const s = results.rows[i];
        const study = {
            nct_id: s.nct_id,
            conditions: s.condi
        };
        studies.push(study);
    }
    await bulkUpdate(studies);
}

const chunkList = (list, size) => {
    let result = []
    for (let i = 0; i < list.length; i += size) {
        let chunk = list.slice(i, i + size)
        result.push(chunk)
    }
    return result;    
};

export const aactReindexAllJob = async () => {
    try {
        if(!IS_RUNNING) {
            IS_RUNNING = true;
            logger.info('Starting AACT Reindex All Job');

            const studyIds = await getAllStudiesToIndex();
            logger.debug("Number of studies to index: "+studyIds.length);
            const bulkList = chunkList(studyIds,CHUNK_SIZE);

            for(let j=0;j<bulkList.length;j++) {
                const idList = bulkList[j];
                // Queue these up for reindexing
                await enqueueJob(JOB_TYPES.AACT_STUDY_REINDEX,{studies: idList});
                // Now queue up reindex of clinwiki
                await clinwikiJob(idList);
            }

            logger.info('Job AACT Finished.')
            IS_RUNNING = false;
        }
    }
    catch(err) {
        logger.error(err);
        IS_RUNNING = false;
    }
};
//aactReindexSingleStudyJob should be only place for an update so no jobs get missed - bulk should call this iterively
//refactor this for efficiency if bulk update of multiple is really needed
//bulk and all call this instead
export const aactReindexSingleStudyJob = async (nctId) => {
    try {
        if(!IS_RUNNING) {
            IS_RUNNING = true;
            logger.info('Starting AACT Reindex Single Job '+nctId);

            const studyIds = await getSingleStudyToIndex(nctId);
            logger.debug("Number of studies to index: "+studyIds.length);
             console.log(util.inspect(studyIds, false, null, true))
            const bulkList = chunkList(studyIds,CHUNK_SIZE);

            for(let j=0;j<bulkList.length;j++) {
                const idList = bulkList[j];
                // Queue these up for reindexing
                await enqueueJob(JOB_TYPES.AACT_STUDY_REINDEX,{studies: idList});
                // Now queue up reindex of clinwiki
                logger.info('Now handling clinwiki data')
                await clinwikiJob(idList);
            }

            logger.info('Job AACT Finished.')
            IS_RUNNING = false;
        }
    }
    catch(err) {
        logger.error(err);
        IS_RUNNING = false;
    }
};

export default aactJob;
