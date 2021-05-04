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