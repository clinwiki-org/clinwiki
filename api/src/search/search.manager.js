const util = require('util');
import {translateSearch,translateAggBuckets} from './translator';
import * as elastic from './elastic';
import {keysToCamel} from '../util/case.convert';

export async function search(args) {
    console.log('search');
    try {
        const translated = await translateSearch(args.params,true);
        //console.log('translated', util.inspect(translated, false, null, true));
        let esResults = await elastic.query(translated);
        //console.log('esResults', util.inspect(esResults, false, null, true));
        const studies = esResults.body.hits.hits.map( study => esToGraphql(study));
        let aggs = [];
        for( const [key,value] of Object.entries(esResults.body.aggregations)) {
            const agg = aggToGraphql(key,value);
            aggs.push(agg);
        }

        //console.log('hits '+esResults.body.hits.total);
        //console.log('studies '+studies.length);
        return {
            recordsTotal: esResults.body.hits.total,
            studies,
            aggs
        };
    }
    catch(err) {
        console.log(err);
    }
}

export async function aggBuckets(args) {
    console.log('aggBuckets');
    try {
        const translated = await translateAggBuckets(args.params,false);
        console.log('translated', util.inspect(translated, false, null, true));
        let esResults = await elastic.query(translated);
        //console.log('esResults', util.inspect(esResults, false, null, true));
        const studies = esResults.body.hits.hits.map( study => esToGraphql(study));
        console.log('aggregations',esResults.body.aggregations)
        let aggs = [];
        for( const [key,value] of Object.entries(esResults.body.aggregations)) {
            const agg = aggToGraphql(key,value);
            aggs.push(agg);
        }
        console.log('aggs',aggs)
        // return {
        //     recordsTotal: esResults.body.hits.total,
        //     studies,
        //     aggs: aggs
        // };
        return {};
    }
    catch(err) {
        console.log(err);
    }
}

function esToGraphql(study) {
    let obj = keysToCamel(study._source);
    obj.studyViewCount = obj.studyViewsCount;
    obj.isFdaRegulated = obj.isFdaRegulatedDrug | obj.isFdaRegulatedDevice;
    obj.averageRating = 0;
    console.log(obj.nctId)
    return obj;
}

function aggToGraphql(key,value) {
    //console.log('key',key,'value',value)
    let buckets = [];
    if(value.buckets) {
        buckets = value[key].buckets.map( bucket => ({
            key: bucket.key,
            keyAsString: bucket.key,
            docCount: bucket.doc_count
        }))
    }

    let agg = {
        name: key,
        buckets: []
    };
    
    return agg;
}