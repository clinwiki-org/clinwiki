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
        // console.log(studies)
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
        // console.log(args)
        let params;
        const results = await query(QUERY_SHORT_LINK, [args.hash]);
        if(results.rows.length===1){
            const link = results.rows[0];
            params = link.long
        }

        let parsedParams = JSON.parse(params);
        let aggFilter =[];
        parsedParams['agg_filters'].map((agg,index)=>{
            let tempAgg = {};
            for (const [key, value] of Object.entries(agg)) {
                if(key=='include_missing_fields'){
                    tempAgg['includeMissingFields'] = value;
                }else{
                    tempAgg[key]=value;
                }
            }
            aggFilter.push(tempAgg)
        });
        parsedParams['agg_filters']=aggFilter;

        let crowdAggFilter=[];
        parsedParams['crowd_agg_filters'].map((agg,index)=>{
            let tempAgg = {};

            for (const [key, value] of Object.entries(agg)) {
                if(key=='include_missing_fields'){
                    tempAgg['includeMissingFields'] = value;
                }else{
                    tempAgg[key]=value;
                }
            }
            crowdAggFilter.push(tempAgg);
        });
        
        parsedParams['crowd_agg_filters']=crowdAggFilter;


        return {
            //reParsing to string as app is expecting that. May want to rework to just return JSON
            searchParams: JSON.stringify(parsedParams)
        }
    }   
    catch(err) {
        logger.error('Error running search: '+err);
    }
}

export async function openCrowdAggBuckets(args) {
    try {
        const translated = await translateOpenCrowdAggBuckets(args.params, args.bucketsWanted);
        let esResults = await elastic.query(translated);
        // console.log("TRANSLATED OPEN Crowd Buckets" + util.inspect(translated, true, null, false)) 
        const studies = esResults.body.hits.hits.map(study => esToGraphql(study));
        let aggs = [];
        let i=0;
        for (const [key, value] of Object.entries(esResults.body.aggregations)) {
            const agg = aggToGraphql2(key, value);
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
        const translated = await translateOpenAggBuckets(args.params, args.bucketsWanted);
        let esResults = await elastic.query(translated);
        const studies = esResults.body.hits.hits.map(study => esToGraphql(study));
        let aggs = [];
        let i=0;
        // console.log("TRANSLATED OPEN  Buckets" + util.inspect(translated,false,null,true)) 
        for (const [key, value] of Object.entries(esResults.body.aggregations)) {
            const agg = aggToGraphql2(key, value);
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
    // console.log("--------->>>>>> STUDY <<<<<<-----------")
    //  console.log(study)
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
function aggToGraphql2(key,value) {
    let buckets = [];
    if(value.buckets) {
        buckets = value.buckets.map( bucket => ({
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