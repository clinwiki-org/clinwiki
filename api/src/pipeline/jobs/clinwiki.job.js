import logger from '../../util/logger';
import {query} from '../../util/db';
import {bulkUpdate} from '../../search/elastic';
const util = require('util')

const WIKI_PAGES_TO_INDEX_QUERY = "select id from wiki_pages where updated_at > localtimestamp - INTERVAL '10 seconds'";
const CHUNK_SIZE = 1000;

let IS_RUNNING = false;

const clinwikiJob = async () => {
    try {
        if(!IS_RUNNING) {
            IS_RUNNING = true;
            logger.info('Starting Clinwiki Job');

            const wikiPageIds = await getWikiPagesToIndex();
            //const studyIds = ['NCT00001431'];
            logger.debug("Number of wiki pages to index: "+wikiPageIds.length);
            const bulkList = chunkList(wikiPageIds,CHUNK_SIZE);

            for(let j=0;j<bulkList.length;j++) {
                const idList = bulkList[j];
                // Queue these up for reindexing
                await enqueueJob(JOB_TYPES.WIKI_TEXT_REINDIX_2ND_PASS,{list: idList});                
            }

            logger.info('Job Clinwiki Finished.')
            IS_RUNNING = false;
        }
    }
    catch(err) {
        logger.error(err);
        IS_RUNNING = false;
    }
};

export const wikiPageReindex = async (payload) => {
    const idList = payload.list;
    const results = await getBulkWikiPages(idList);
                
    let wikiPages = [];
    for(let i=0;i<results.rowCount;i++) {
        const wikiPage = results.rows[i];                    
        wikiPages.push(esWikiPage(wikiPage));
    }
    logger.info("Sending bulk update of "+idList.length);
    await bulkUpdate(wikiPages);
    logger.info("Bulk update complete.");
}

const getWikiPagesToIndex = async () => {
    const rs = await query(WIKI_PAGES_TO_INDEX_QUERY,[]);
    return rs.rows.map( row => row.id);
};

const getBulkWikiPages = async (idList) => {
    let params = idList.map( (id,index) => '$'+(index+1));
    const wikiQuery = 'select * from wiki_pages where id in ('+params.join(',')+')';
    const rs = await query(wikiQuery,idList);
    return rs;
}

const chunkList = (list, size) => {
    let result = []
    for (let i = 0; i < list.length; i += size) {
        let chunk = list.slice(i, i + size)
        result.push(chunk)
    }
    return result;    
};

const esWikiPage = (row) => {
    let es = {};
    es.nct_id = row.nct_id;
    es.wiki_text = row.text;
    return es;
}

export default clinwikiJob;
