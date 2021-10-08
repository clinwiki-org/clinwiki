import {  getHasuraClinwikiURL } from './../../utils/graphqlUtil';
import * as mutate from './mutations';
import {
    callHasuraClinwiki, 
    callGraphql,     
    getGraphQLMigrationURL,

} from 'utils/graphqlUtil';

const HASURA_CW = getHasuraClinwikiURL();

const NODE_ENDPOINT = getGraphQLMigrationURL();

export const InsertPageViewLog = (userId: number, url: string ) =>{
    return callHasuraClinwiki(HASURA_CW, mutate.INSERT_PAGE_VIEW_LOG,{
        userId,
        url
    })
}

export const fetchGenericPage= (value: any, variable: any,  QUERY: any, useHasura:boolean) => {
        let endPoint = useHasura ? HASURA_CW : NODE_ENDPOINT;
        let object ={}
        object[variable] = value
    return variable == 'null' ? callGraphql(endPoint, QUERY, undefined): callGraphql(endPoint, QUERY,object);
};
