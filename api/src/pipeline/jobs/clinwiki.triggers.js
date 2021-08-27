import logger from '../../util/logger';
import config from '../../../config';
import {bulkUpdate, bulkUpdateCrowdKeys} from '../../search/elastic';
import * as elastic from '../../search/elastic';
const util = require('util');
import {aactReindexSingleStudyJob} from './aact.job.js';
import { JOB_TYPES, enqueueJob } from '../pipeline.queue';

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
    //TO-DO probably need a better check for index and primary key. 
    let primaryKey = config.defaultApp == "clinwiki"? 'nct_id' :'condition_id';
    let indexName = config.defaultApp == "clinwiki"? config.elasticIndex : config.elasticIndexDIS; 
    //Not sure if best to directly que or call our reindexDocumentJob like prev done with aact
    await enqueueJob(JOB_TYPES.DOCUMENT_REINDEX, { primaryKey, primaryKeyList: [docId], indexName });

}
