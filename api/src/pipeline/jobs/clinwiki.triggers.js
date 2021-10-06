import logger from '../../util/logger';
import { queryHasura } from '../../util/db';
import config from '../../../config';
import { bulkUpdate } from '../../search/elastic';
const util = require('util');
import { JOB_TYPES, enqueueJob } from '../pipeline.queue';

const INSERT_CROWD_KEY_VALUE_IDS_AUDIT =  `
mutation InsertCrowdKeyValueIdsAudit(
    $approved: Boolean,
    $created_at: timestamptz,
    $crowd_key: String,
    $crowd_key_value_id_association: String,
    $crowd_value: String,
    $evidence: String,
    $id: Int,
    $indexed: Boolean,
    $updated_at: timestamptz,
    $user_id: Int,
    $verified: Boolean
    ){
     insert_crowd_key_value_ids_audit(objects:{
      approved:$approved,
      ckvi_created_at:$created_at,
      ckvi_id:$id,
      ckvi_updated_at:$updated_at,
      crowd_key:$crowd_key,
      crowd_key_value_id_association:$crowd_key_value_id_association,
      crowd_value:$crowd_value,
      evidence:$evidence,
      indexed:$indexed,
      user_id:$user_id,
      verified:$verified
    }) {
      returning{
           id
        created_at
        crowd_key
        crowd_value
      }
    }
    }
`
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
    
    let docId = payload.crowd_key_value_id_association
    //TO-DO probably need a better check for index and primary key. 
    let primaryKey = config.defaultApp == "clinwiki"? 'nct_id' :'condition_id';
    let indexName = config.defaultApp == "clinwiki"? config.elasticIndex : config.elasticIndexDIS; 
    //Not sure if best to directly que or call our reindexDocumentJob like prev done with aact
    await enqueueJob(JOB_TYPES.DOCUMENT_REINDEX, { primaryKey, primaryKeyList: [docId], indexName });

}
export const triggerCrowdKeyValueIdsJobs = async (payload) => {
    logger.debug('Triggering Crowd Key Value Jobs');
    let rowInfo = JSON.parse(payload[1])
    let triggerInfo = JSON.parse(payload[0])
    const hasuraInstance = config.defaultApp == 'clinwiki'? "studies" : "dis"
    logger.debug('Step 1, insert into audit table');
    await queryHasura(INSERT_CROWD_KEY_VALUE_IDS_AUDIT, rowInfo , hasuraInstance );
    logger.debug('Step 2, trigger reindex index ');
    await indexCrowdKeyValueIds(rowInfo)
  
}
