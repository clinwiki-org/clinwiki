import { JOB_TYPES, enqueueJob } from '../pipeline.queue';
import { bulkUpdate } from '../../search/elastic';
import logger from '../../util/logger';
import {query} from '../../util/db';
import moment from 'moment';
const util = require('util')

const CHUNK_SIZE = 1000;

export const clinwikiJob = async nctIdList => {
    try {
        logger.info('Starting Clinwiki Job');
        const wikiPageIds = await getWikiPagesIdsByNctId(nctIdList);
        // logger.debug('WIKI PAGE IDS', wikiPageIds);
        //const studyIds = ['NCT00001431'];
        // logger.debug('Number of wiki pages to index: ' + wikiPageIds.length);
        const bulkWikiList = chunkList(wikiPageIds, CHUNK_SIZE);

        for (let j = 0; j < bulkWikiList.length; j++) {
            const idList = bulkWikiList[j];
            // Queue these up for reindexing
            await enqueueJob(JOB_TYPES.WIKI_TEXT_BULK_REINDIX, {
                list: idList,
            });
        }

        const crowdKeyIds = await getCrowdKeysToIndex(nctIdList);
        logger.debug('Number of crowd keys to index: ' + crowdKeyIds.length);
        const bulkKeyList = chunkList(crowdKeyIds, CHUNK_SIZE);

        for (let j = 0; j < bulkKeyList.length; j++) {
            const idList = bulkKeyList[j];
            // Queue these up for reindexing
            await enqueueJob(JOB_TYPES.CROWD_KEY_BULK_REINDEX, {
                list: idList,
            });
        }

        logger.info('Job Clinwiki Finished.');
    } catch (err) {
        logger.error(err);
    }
};

export const wikiPageReindex = async payload => {
    const idList = payload.list;
    // logger.info('ID LIST FOR WIKIS', idList);
    const results = await getBulkWikiPages(idList);

    let wikiPages = [];
    for (let i = 0; i < results.rowCount; i++) {
        const wikiPage = results.rows[i];
        wikiPages.push(esWikiPage(wikiPage));
    }
    logger.info('Sending bulk update of ' + idList.length);
    await bulkUpdate(wikiPages);
    logger.info('Bulk update complete.');
};

const getWikiPagesIdsByNctId = async idList => {
    let params = idList.map((id, index) => '$' + (index + 1));
    const wikiQuery =
        'select id from wiki_pages where nct_id in (' + params.join(',') + ')';
    // logger.info('WIKI PAGES TO INDEx', idList);
    const rs = await query(wikiQuery, idList);
    return rs.rows.map(row => row.id);
};

const getCrowdKeysToIndex = async idList => {
    let params = idList.map((id, index) => '$' + (index + 1));
    const wikiQuery =
        'select id from crowd_key_value_ids where crowd_key_value_id_association in (' +
        params.join(',') +
        ')';
    // logger.debug(wikiQuery);
    const rs = await query(wikiQuery, idList);
    return rs.rows.map(row => row.id);
};

const getBulkWikiPages = async (idList) => {
    console.log("BULK WIKI PAGES")
    let params = idList.map( (id,index) => '$'+(index+1));
    const wikiQuery = 'select * from wiki_pages where id in ('+params.join(',')+')';
    const rs = await query(wikiQuery,idList);
    return rs;
};

const chunkList = (list, size) => {
    let result = [];
    for (let i = 0; i < list.length; i += size) {
        let chunk = list.slice(i, i + size);
        result.push(chunk);
    }
    return result;
};

const esWikiPage = row => {
    let es = {};
    es.nct_id = row.nct_id;
    es.wiki_text = row.text;
    // console.log('DATE NOW', es)
    return es;
};

export const crowdKeyReindex = async payload => {
    const idList = payload.list;
    // console.log('IDLIST from CROWD KEY INDEX', idList);
    const results = await getBulkCrowdKeys(idList);
                
    // console.log("In Crwod-reindex")
    // console.log('CROWD KEY RESULTS', results)
    //let crowdKeys = [];
    // for(let i=0;i<results.rowCount;i++) {
    //     const crowdKey = results.rows[i];
    //     crowdKeys.push(esCrowdKey(crowdKey));
    // }

    let crowdMap = new Map();
    for (let i = 0; i < results.rowCount; i++) {
        const crowdKeyRow = results.rows[i];
 
        let ckStudy = crowdMap.get(crowdKeyRow.crowd_key_value_id_association);

        if (!ckStudy) {
            ckStudy = { nct_id: crowdKeyRow.crowd_key_value_id_association };
            ckStudy.front_matter_keys = [];
        }
        // ckStudy['fm_' + crowdKeyRow.crowd_key] =  ckStudy['fm_' + crowdKeyRow.crowd_key];
        /// we need to do something similar to this.
        // console.log(crowdKeyRow)
        // console.log(ckStudy)
        // console.log('PRE PUSH', ckStudy['fm_' + crowdKeyRow.crowd_key])
   
        // ckStudy['fm_' + crowdKeyRow.crowd_key] ? ckStudy['fm_' + crowdKeyRow.crowd_key].push(crowdKeyRow.crowd_value) : ckStudy['fm_' + crowdKeyRow.crowd_key] = [crowdKeyRow.crowd_value];
        if (ckStudy['fm_' + crowdKeyRow.crowd_key]) {
            ckStudy['fm_' + crowdKeyRow.crowd_key].push(crowdKeyRow.crowd_value)
        } else {
            ckStudy['fm_' + crowdKeyRow.crowd_key] = [crowdKeyRow.crowd_value];
        }
        if (ckStudy.front_matter_keys.indexOf(crowdKeyRow.crowd_key) === -1) {
            ckStudy.front_matter_keys.push(crowdKeyRow.crowd_key);
        }
        crowdMap.set(crowdKeyRow.crowd_key_value_id_association, ckStudy);

    }
    
    let crowdKeys = [...crowdMap.values()];
    let response = await bulkUpdate(crowdKeys);

    // console.log('_____________________');
    // console.log(util.inspect(response, false, null, true));
    logger.info('Bulk update complete.');
};

const getBulkCrowdKeys = async idList => {
    let params = idList.map((id, index) => '$' + (index + 1));
    const crowdKeyQuery =
        'select * from crowd_key_value_ids where id in (' +
        params.join(',') +
        ')';
    const rs = await query(crowdKeyQuery, idList);
    return rs;
};

export default clinwikiJob;


