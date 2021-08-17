import logger from '../../util/logger';
import {bulkUpdate, bulkUpdateCrowdKeys} from '../../search/elastic';
import * as elastic from '../../search/elastic';
const util = require('util');
import {aactReindexSingleStudyJob} from './aact.job.js';
import { JOB_TYPES, enqueueJob } from '../pipeline.queue';
import config from '../../../config';


export const indexWikiPage = async (payload) => {
    logger.debug('Indexing Wiki Page '+payload)
    let rowInfo = JSON.parse(payload[1])

    const list = [{
        nct_id: rowInfo.nct_id,
        wiki_text: rowInfo.text
    }];
    await bulkUpdate(list);
};

export const indexCrowdKeyValueIds = async (payload) => {
    logger.debug('Indexing Crowd Key Values', payload);
    let rowInfo = JSON.parse(payload[1])
    let triggerInfo = JSON.parse(payload[0])
    let docId = rowInfo.crowd_key_value_id_association

    // aactReindexSingleStudyJob(docId)
    // TO-DO: Genericise!
    // *******************
    //for DIS
    let indexName = config.elasticIndexDIS;
    await enqueueJob(JOB_TYPES.DOCUMENT_REINDEX, { primaryKeyList: [docId], primaryKey: 'condition_id', indexName: indexName });
    await enqueueJob(JOB_TYPES.CROWD_KEY_BULK_REINDEX, {
        list: docId,
    });

    //for studies 
    // let indexName = config.elasticIndex;
    // await enqueueJob(JOB_TYPES.DOCUMENT_REINDEX, { primaryKeyList: [docId], primaryKey: 'nct_id', indexName: indexName });
    // await enqueueJob(JOB_TYPES.CROWD_KEY_BULK_REINDEX, {
    //     list: docId,
    // });
    // *******************
   
}