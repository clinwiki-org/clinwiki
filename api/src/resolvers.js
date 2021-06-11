import userResolver from './users/user.resolver';
import searchResolver from './search/search.resolver';
import adminResolver from './admin/admin.resolver';

const rootResolver = combineResolvers(userResolver,searchResolver,adminResolver);


function combineResolvers() {
    let root = {};
    for(let i=0;i<arguments.length;i++) {
        root = {...root,...arguments[i]}
    }
    return root;
}

export default rootResolver;