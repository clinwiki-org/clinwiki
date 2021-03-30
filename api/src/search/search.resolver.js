const util = require('util');
import * as SearchManager from './search.manager';

const searchResolver = {
    search: async (args,context) => {
        console.log('searchResolver.search')
        //console.log(util.inspect(args, false, null, true));
        const results = await SearchManager.search(args);
        return results;
    },
    aggBuckets: async (args,context) => {
        console.log('searchResolver.aggBuckets')
        //console.log('##### AGGBUCKETS'+util.inspect(args, false, null, true));
        const results = await SearchManager.aggBuckets(args);
        return results;

    }
    
}

export default searchResolver;
