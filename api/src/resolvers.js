import userResolver from './users/user.resolver';
import searchResolver from './search/search.resolver';

const rootResolver = combineResolvers(userResolver,searchResolver);


function combineResolvers() {
    let root = {};
    for(let i=0;i<arguments.length;i++) {
        root = {...root,...arguments[i]}
    }
    return root;
}

export default rootResolver;