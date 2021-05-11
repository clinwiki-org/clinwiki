const util = require('util');
import { translateSearch, translateAggBuckets, translateCrowdAggBuckets, translateOpenAggBuckets, translateOpenCrowdAggBuckets } from './translator';
import * as elastic from './elastic';
import {keysToCamel} from '../util/case.convert';
import logger from '../util/logger';
import { query } from '../util/db';

const QUERY_SHORT_LINK = 'select * from short_links where short=$1';

export async function search(args) {
    try {
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        const translated = await translateSearch(args.params,true);
        // console.log("-------------->  ELASTIC SEARCH QUERY <------------- " + util.inspect(translated, false, null, true))
        let esResults = await elastic.query(translated);

        const studies = esResults.body.hits.hits.filter(study => study._source.nct_id?true:false).map( study => esToGraphql(study));
        let aggs = [];
        for( const [key,value] of Object.entries(esResults.body.aggregations)) {
            const agg = aggToGraphql(key,value);
            aggs.push(agg);
        }

        return {
            recordsTotal: esResults.body.hits.total,
            studies,
            aggs
        };
    }
    catch(err) {
        logger.error('Error running search: '+err);
    }
}
export async function searchParams(args) {
    try {
        console.log(args)
        let params;
        const results = await query(QUERY_SHORT_LINK, [args.hash]);
        if(results.rows.length===1){
            const link = results.rows[0];
            params = link.long
            console.log("--------PARAMS-----", params)

        }
        console.log("___________>>>>SERACH PARAMS<<<<<__________", params)
        return {
            searchParams: params
        }
    }   
    catch(err) {
        logger.error('Error running search: '+err);
    }
}

export async function aggBuckets(args) {
    try {
        const translated = await translateAggBuckets(args.params,false);
        //console.log('##### AGGBUCKETS'+util.inspect(translated, false, null, true));
        let esResults = await elastic.query(translated);
        
        const studies = esResults.body.hits.hits.map( study => esToGraphql(study));
        let aggs = [];
        for (const [key, value] of Object.entries(esResults.body.aggregations)) {
            const agg = aggToGraphql(key, value);
            if (args.bucketsWanted?.length !== 0) {
                let finalBuckets = [];
                agg.buckets.map((bucket) => {
                    for (const key of args.bucketsWanted) {
                        if (key == bucket.key) {
                            finalBuckets.push(bucket)
                        }
                    }
                })
                aggs.push({ ...agg, buckets: finalBuckets });
            }else{
                aggs.push(agg)
            }
        }
        return {
            recordsTotal: esResults.body.hits.total,
            aggs: aggs
        };
    }
    catch(err) {
        logger.error(err);
    }
}

export async function crowdAggBuckets(args) {
    try {
        const translated = await translateCrowdAggBuckets(args.params, false);
        let esResults = await elastic.query(translated);
        console.log("TRANSLATED CrowdBuckets", translated) 
        const studies = esResults.body.hits.hits.map(study => esToGraphql(study));
        let aggs = [];
        for (const [key, value] of Object.entries(esResults.body.aggregations)) {
            const agg = aggToGraphql(key, value);
            if (args.bucketsWanted?.length !== 0) {
                let finalBuckets = [];
                agg.buckets.map((bucket) => {
                    for (const key of args.bucketsWanted) {
                        if (key == bucket.key) {
                            finalBuckets.push(bucket)
                        }
                    }
                })
                aggs.push({ ...agg, buckets: finalBuckets });
            }else{
                aggs.push(agg)
            }
        }
        return {
            recordsTotal: esResults.body.hits.total,
            aggs: aggs
        };
    }
    catch(err) {
        logger.error(err);
    }
}

export async function openCrowdAggBuckets(args) {
    try {
        const translated = await translateOpenCrowdAggBuckets(args.params, false);
        let esResults = await elastic.query(translated);
        console.log("TRANSLATED OPEN Crowd Buckets", translated) 
        const studies = esResults.body.hits.hits.map(study => esToGraphql(study));
        let aggs = [];
        let i=0;
        for (const [key, value] of Object.entries(esResults.body.aggregations)) {
            const agg = aggToGraphql(key, value);
            if (args.bucketsWanted[i].values.length !== 0) {
                let finalBuckets = [];
                agg.buckets.map((bucket) => {
                    for (const key of args.bucketsWanted[i].values) {
                        if (key == bucket.key) {
                            finalBuckets.push(bucket)
                        }
                    }
                })
                aggs.push({ ...agg, buckets: finalBuckets });
                i++
            }else{
                aggs.push(agg)
            i++
            }
        }
        return {
            recordsTotal: esResults.body.hits.total,
            aggs: aggs
        };
    }
    catch(err) {
        logger.error(err);
    }
}
export async function openAggBuckets(args) {
    try {
        const translated = await translateOpenAggBuckets(args.params, false);
        let esResults = await elastic.query(translated);
        console.log("TRANSLATED OPEN Buckets", translated) 
        const studies = esResults.body.hits.hits.map(study => esToGraphql(study));
        let aggs = [];
        let i=0;
        for (const [key, value] of Object.entries(esResults.body.aggregations)) {
            const agg = aggToGraphql(key, value);
            if (args.bucketsWanted[i].values.length !== 0) {
                let finalBuckets = [];
                agg.buckets.map((bucket) => {
                    for (const key of args.bucketsWanted[i].values) {
                        if (key == bucket.key) {
                            finalBuckets.push(bucket)
                        }
                    }
                })
                aggs.push({ ...agg, buckets: finalBuckets });
                i++
            }else{
                aggs.push(agg)
            i++
            }
        }
        return {
            recordsTotal: esResults.body.hits.total,
            aggs: aggs
        };
    }
    catch(err) {
        logger.error(err);
    }
}

function esToGraphql(study) {
    let obj = keysToCamel(study._source);
    obj.studyViewCount = obj.studyViewsCount;
    obj.isFdaRegulated = obj.isFdaRegulatedDrug | obj.isFdaRegulatedDevice;
    obj.averageRating = 0;
    return obj;
}

function aggToGraphql(key,value) {
    let buckets = [];
    if(value[key].buckets) {
        buckets = value[key].buckets.map( bucket => ({
            key: bucket.key,
            keyAsString: bucket.key,
            docCount: bucket.doc_count
        }))
    }

    let agg = {
        name: key,
        buckets
    };
    
    return agg;
}