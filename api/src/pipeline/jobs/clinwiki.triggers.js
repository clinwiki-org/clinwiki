import logger from '../../util/logger';
import {bulkUpdate, bulkUpdateCrowdKeys} from '../../search/elastic';
import * as elastic from '../../search/elastic';
const util = require('util')

export const indexWikiPage = async (payload) => {
    logger.debug('Indexing Wiki Page '+payload)
    const list = [{
        nct_id: payload.nct_id,
        wiki_text: payload.text
    }];
    await bulkUpdate(list);
};

export const indexCrowdKeyValueIds = async (payload) => {
    logger.debug('Indexing Crowd Key Values');

    // console.log("about to query for elastic doc")
    let esResults = await elastic.query({
        "query": {
            "bool": {
                "must": {
                    "simple_query_string": {
                        "fields": ["nct_id"],
                        "query": payload.crowd_key_value_id_association
                    }
                }
            }
        }
    });
    console.log("ESRESULTS" + util.inspect(esResults, false, null, true)); 
    let indexData = esResults.body.hits.hits[0]._source; 
    let frontMatterKeys = indexData.front_matter_keys ? indexData.front_matter_keys : []
    const list = [{
        nct_id: payload.crowd_key_value_id_association, 
        [`fm_${payload.crowd_key}`]: indexData[`fm_${payload.crowd_key}`] ? [...indexData[`fm_${payload.crowd_key}`], payload.crowd_value] : [payload.crowd_value],
        front_matter_keys: frontMatterKeys.includes(payload.crowd_key) ? [payload.crowd_key] : [...indexData.front_matter_keys, payload.crowd_key]
        //Below values not added as no current use/development
        // user_id: payload.user_id,
        // verified: payload.verified,
        // approved: payload.approved,
        // evidenced: payload.evidence
    }];
    await bulkUpdate(list);
}

// export const indexCrowdKeys = async (payload) => {
//     logger.debug('Indexing Wiki Page '+payload)
//     const list = [{
//         crowd_key: payload.crowd_key,
//         crowd_key_type: payload.crowd_key_type,
//         crowd_key_data_type: payload.crowd_key_data_type,
//         crowd_key_primarykey: payload.crowd_key_primarykey,
//         default_facet_type: payload.default_facet_type,
//         indexed_type: payload.indexed_type,
//         crowd_key_description: payload.crowd_key_description,
//         crowd_key_helper_text: payload.crowd_key_helper_text,
//         crowd_key_status: payload.crowd_key_status,
//         crowd_key_default_icon: payload.crowd_key_default_icon,
//     }];
//     await bulkUpdate(list);
// }

// export const indexCrowdValues = async (payload) => {
//     logger.debug('Indexing Wiki Page '+payload)
//     const list = [{
//         crowd_key_id: payload.crowd_key_id,
//         crowd_value: payload.crowd_value,
//         crowd_value_description: payload.crowd_value_description,
//         crowd_value_helper_text: payload.crowd_value_helper_text,
//         crowd_value_status: payload.crowd_value_status,
//         crowd_value_default_icon: payload.crowd_value_default_icon,
//     }];
//     await bulkUpdate(list);
// }