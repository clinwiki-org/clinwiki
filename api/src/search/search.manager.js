const util = require('util');
import translate from './translator';
import * as elastic from './elastic';

export async function runSearch(args) {
    console.log('runSearch');
    try {
        const translated = await translate(args.params);
        console.log('translated', util.inspect(translated, false, null, true));
        let esResults = await elastic.query(translated);
        console.log('esResults', util.inspect(esResults, false, null, true));
        return esResults;
    }
    catch(err) {
        console.log(err);
    }
}