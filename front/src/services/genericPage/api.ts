import {  getHasuraClinwikiURL } from './../../utils/graphqlUtil';
import * as mutate from './mutations';
import {
    callHasuraClinwiki,
} from 'utils/graphqlUtil';

const HASURA_CW = getHasuraClinwikiURL();


export const InsertPageViewLog = (userId: number, url: string ) =>{
    return callHasuraClinwiki(HASURA_CW, mutate.INSERT_PAGE_VIEW_LOG,{
        userId,
        url
    })
}

