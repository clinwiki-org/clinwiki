const util = require('util');
import translate from './translator';
import * as elastic from './elastic';
import {keysToCamel} from '../util/case.convert';

export async function runSearch(args) {
    console.log('runSearch');
    try {
        const translated = await translate(args.params);
        console.log('translated', util.inspect(translated, false, null, true));
        let esResults = await elastic.query(translated);
        console.log('esResults', util.inspect(esResults, false, null, true));
        const studies = esResults.body.hits.hits.map( study => esToGraphql(study));
        console.log(studies);
        return {
            recordsTotal: esResults.body.hits.total,
            studies,
            aggs: esResults.body.hits.aggs,
        };
    }
    catch(err) {
        console.log(err);
    }
}

function esToGraphql(study) {
    let obj = keysToCamel(study._source);
    obj.studyViewCount = obj.studyViewsCount;
    obj.isFdaRegulated = obj.isFdaRegulatedDrug | obj.isFdaRegulatedDevice;
    return obj;
}