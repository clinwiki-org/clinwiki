const util = require('util');
import * as SearchManager from './search.manager';

const searchResolver = {
    search: async (args,context) => {
        logger.info('PARGS', args)
        //console.log(util.inspect(args, false, null, true));
        const results = await SearchManager.search(args);
        return results;
    },
    aggBuckets: async (args,context) => {
        //console.log('##### AGGBUCKETS'+util.inspect(args, false, null, true));
        const results = await SearchManager.aggBuckets(args);
        return results;

    },
    crowdAggBuckets: async (args,context) => {
        const results = await SearchManager.crowdAggBuckets(args);
        return results;
    },
    openCrowdAggBuckets: async (args,context) => {
        // console.log('##### CROWD AGGBUCKETS'+util.inspect(args, false, null, true));
        const results = await SearchManager.openCrowdAggBuckets(args);
        return results;
    },
    openAggBuckets: async (args,context) => {
        // console.log('##### AGGBUCKETS'+util.inspect(args, false, null, true));
        const results = await SearchManager.openAggBuckets(args);
        return results;
    },
    crowdAggFacets: async (args,context) => {
        console.log('searchResolver.crowdAggFacets')
        return "";
    },
    searchParams: async (args,context) => {
        logger.info('PARGS', args)
        const results = await SearchManager.searchParams(args);
        console.log(">>>>>>>RESOLVER<<<<<<<<")
        console.log("Results", results)
        return results;
    },
    provisionSearchHash: async (args,context) => {
        const results = await SearchManager.provisionSearchHash(args);
        return results;
    }
    
}

export default searchResolver;
