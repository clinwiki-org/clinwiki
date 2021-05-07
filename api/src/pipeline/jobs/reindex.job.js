import logger from '../../util/logger';
import {query} from '../../util/db';
import {bulkUpdate} from '../../search/elastic';
const util = require('util')

const QUERY_WIKI_PAGE = 'select * from wiki_pages where id=$1';

export const reindexWikiPage = async (payload) => {
    if(payload.id) {
        let results = await query(QUERY_WIKI_PAGE,[payload.id]);
        let wikiPages = [];
        for(let i=0;i<results.rowCount;i++) {
            const wikiPage = results.rows[i];                    
            wikiPages.push(esWikiPage(wikiPage));
        }
        await bulkUpdate(wikiPages);
    }
};

const esWikiPage = (row) => {
    let es = {};
    es.nct_id = row.nct_id;
    es.wiki_text = row.text;
    return es;
}
