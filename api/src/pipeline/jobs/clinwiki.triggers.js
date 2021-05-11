import logger from '../../util/logger';
import {bulkUpdate} from '../../search/elastic';
const util = require('util')

export const indexWikiPage = async (payload) => {
    logger.debug('Indexing Wiki Page '+payload)
    const list = [{
        nct_id: payload.nct_id,
        wiki_text: payload.text
    }];
    await bulkUpdate(list);
};

export const indexCrowdKeyValueIds = (payload) => {
    logger.debug('Indexing Wiki Page '+payload)
    const list = [{
        crowd_key: payload.crowd_key,
        crowd_value: payload.crowd_value,
        crowd_key_value_id_association: payload.crowd_key_value_id_association,
        user_id: payload.user_id,
        verified: payload.verified,
        approved: payload.approved,
        evidenced: payload.evidence
    }];
    await bulkUpdate(list);
}

export const indexCrowdKeys = (payload) => {
    logger.debug('Indexing Wiki Page '+payload)
    const list = [{
        crowd_key: payload.crowd_key,
        crowd_key_type: payload.crowd_key_type,
        crowd_key_data_type: payload.crowd_key_data_type,
        crowd_key_primarykey: payload.crowd_key_primarykey,
        default_facet_type: payload.default_facet_type,
        indexed_type: payload.indexed_type,
        crowd_key_description: payload.crowd_key_description,
        crowd_key_helper_text: payload.crowd_key_helper_text,
        crowd_key_status: payload.crowd_key_status,
        crowd_key_default_icon: payload.crowd_key_default_icon,
    }];
    await bulkUpdate(list);
}

export const indexCrowdValues = (payload) => {
    logger.debug('Indexing Wiki Page '+payload)
    const list = [{
        crowd_key_id: payload.crowd_key_id,
        crowd_value: payload.crowd_value,
        crowd_value_description: payload.crowd_value_description,
        crowd_value_helper_text: payload.crowd_value_helper_text,
        crowd_value_status: payload.crowd_value_status,
        crowd_value_default_icon: payload.crowd_value_default_icon,
    }];
    await bulkUpdate(list);
}