import * as query from './queries';
import * as mutate from './mutations'
import { callGraphql } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = `http://${window.location.hostname}:3000/graphql`

export const fetchSampleStudy= (nctId: any) => {
    return callGraphql(ENDPOINT, query.SAMPLE_STUDY_QUERY, {nctId: nctId});
};
export const fetchStudyPage= (nctId: any, QUERY:any) => {
    return callGraphql(ENDPOINT, QUERY, {nctId});
};
export const fetchPageViews= (siteId: any) => {
    return callGraphql(ENDPOINT, query.PAGE_VIEWS_QUERY, {siteId: siteId.siteId});
};
export const fetchPageView= (url:any) => {
    console.log( url)
    return callGraphql(ENDPOINT, query.PAGE_VIEW_QUERY, {url: url.url});
};
export const updateStudyViewLogCount = (nctId:any) =>{
    console.log(nctId)
    return callGraphql(ENDPOINT,mutate.CREATE_STUDY_VIEW_LOG_MUTATION, {nctId})
}

export const createPageView = (url, siteId) => {
    return callGraphql(ENDPOINT, mutate.CREATE_PAGE_VIEW_MUTATION,
        { url: url, siteId: siteId });                           
};
export const updatePageView = (input) => {
    return callGraphql(ENDPOINT, mutate.UPDATE_PAGE_VIEW_MUTATION, 
        { input: input });
};
export const deletePageView = ( id ) => {
    return callGraphql(ENDPOINT, mutate.DELETE_PAGE_VIEW_MUTATION, 
        {  id: id });                                    
};
