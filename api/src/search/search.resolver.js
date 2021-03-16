const util = require('util');
import * as SearchManager from './search.manager';

const searchResolver = {
    search: async (args,context) => {
        console.log(util.inspect(args, false, null, true));
        const results = await SearchManager.runSearch(args);
        return results;
    }
    
}

export default searchResolver;
