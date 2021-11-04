import {  getHasuraClinwikiURL } from './../../utils/graphqlUtil';
import * as mutate from './mutations';
import {
    callHasuraClinwiki,
} from 'utils/graphqlUtil';
import {META_TABLE_QUERY} from './queries'
const HASURA_CW = getHasuraClinwikiURL();


export const InsertPageViewLog = (userId: number, url: string ) =>{
    return callHasuraClinwiki(HASURA_CW, mutate.INSERT_PAGE_VIEW_LOG,{
        userId,
        url
    })
}


export const fetchMetaFields = (formName: string) => {
    //console.log("fetchSiteProviderHasura called in hasuraSite api")
    return callHasuraClinwiki(HASURA_CW, META_TABLE_QUERY, {
      formName
    });
  };
