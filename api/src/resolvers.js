import userResolver from './users/user.resolver';

const rootResolver = combineResolvers(userResolver);


function combineResolvers() {
    let root = {};
    for(let i=0;i<arguments.length;i++) {
        root = {...root,...arguments[i]}
    }
    return root;
}

export default rootResolver;