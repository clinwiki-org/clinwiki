import logger from '../util/logger';
import config from '../../config';
const util = require('util');
const esb = require('elastic-builder');
const zg = require('zip2geo');

const ENABLED_AGGS = [
    'average_rating', 'overall_status', 'facility_states', 'conditions',
    'facility_cities', 'facility_names', 'facility_countries', 'study_type', 'sponsors',
    'browse_condition_mesh_terms', 'phase', 'rating_dimensions',
    'browse_interventions_mesh_terms', 'interventions_mesh_terms',
    'front_matter_keys', 'start_date', 'wiki_page_edits.email', 'wiki_page_edits.created_at',
    'reactions.kind', 'indexed_at', 'last_update_posted_date',
    'last_changed_date',  'number_of_arms', 'study_views_count',
    'number_of_groups', 'why_stopped', 'results_first_submitted_date',
    'plan_to_share_ipd', 'design_outcome_measures',
    'location'
  ];


export const translateSearch = async (criteria,includeSize,lastDate) => {

    let boolQuery = esb.boolQuery();
    boolQuery.must(esb.simpleQueryStringQuery('*'));
    await translateAggFilters(criteria.aggFilters,boolQuery,false);
    await translateAggFilters(criteria.crowdAggFilters,boolQuery,true);

    if(criteria.q.key === 'AND' && criteria.q.children) {
        criteria.q.children.forEach( child => {
            boolQuery.must(esb.simpleQueryStringQuery('('+child.key+')') );
        })
    }
    if(criteria.q.key === 'OR' && criteria.q.children) {
        criteria.q.children.forEach( child => {
            boolQuery.should(esb.simpleQueryStringQuery('('+child.key+')') );
        })
    }

    if(lastDate) {
        const dateString = (lastDate.getMonth()+1)+'/'+lastDate.getDate()+'/'+lastDate.getFullYear();
        logger.debug('indexed_at dateString: '+dateString);
        boolQuery.must(esb.simpleQueryStringQuery('indexed_at:{'+dateString+' TO *}'));
    }

    // Create the aggs and crowd aggs
    let requestBody;
    if(includeSize) {
        requestBody = esb.requestBodySearch().query( boolQuery ).from(0).size(criteria.pageSize);
    }
    else {
        requestBody = esb.requestBodySearch().query( boolQuery ).size(0);
    }
    
    const json = requestBody.toJSON();
    //translateAgg(criteria,json);
    injectAggs(criteria,json);


    return json;
}


export const translateAggBuckets = async (criteria) => {

    let boolQuery = esb.boolQuery();
    boolQuery.must(esb.simpleQueryStringQuery('*'));
    await translateAggFilters(criteria.aggFilters,boolQuery,false);
    await translateAggFilters(criteria.crowdAggFilters,boolQuery,true);

    if(criteria.q.key === 'AND' && criteria.q.children) {
        criteria.q.children.forEach( child => {
            boolQuery.must(esb.simpleQueryStringQuery('('+child.key+')') );
        })
    }
    if(criteria.q.key === 'OR' && criteria.q.children) {
        criteria.q.children.forEach( child => {
            boolQuery.should(esb.simpleQueryStringQuery('('+child.key+')') );
        })
    }

    // Create the aggs and crowd aggs
    let requestBody = esb.requestBodySearch().query( boolQuery ).from(0).size(100);
    
    const json = requestBody.toJSON();
    injectAggs(criteria,json);


    return json;
}


const translateAggFilters = async (aggFilters,boolQuery,isCrowdAgg) => {
    if(aggFilters) {
        for(let i=0;i<aggFilters.length;i++) {
            let agg = aggFilters[i];
            let tf = await translateFilterTerm(agg,isCrowdAgg);
            await boolQuery.must(tf);
        }
    }
};

const translateFilterTerm = async (agg,isCrowdAgg) => {
    if(agg.gte || agg.lte || agg.gt || agg.lt) {        
        // This is a range term
        return await translateRangeTerm(agg,isCrowdAgg);
    }
    if(agg.lat || agg.long || agg.radius || agg.zipcode) {
        return await translateGeoLoc(agg,isCrowdAgg);
    }
    return translateValueTerms(agg,isCrowdAgg);
};

const translateRangeTerm = async (agg,isCrowdAgg) => {
    //logger.debug('translateRangeTerm '+agg);
    let query = await esb.rangeQuery(getFieldName(agg,isCrowdAgg));
    if(agg.lte) {
        query = await query.lte(agg.lte);
    }
    if(agg.gte) {
        query = await query.gte(agg.gte);
    }
    return query;
};

const translateValueTerms = (agg,isCrowdAgg) => {
    let list = [];
    agg.values.forEach( val => {
        let valQuery = esb.termQuery(getFieldName(agg,isCrowdAgg),val);
        //logger.debug('valQuery '+util.inspect(valQuery, false, null, true));
        list.push(valQuery); 
    });
    let bq = esb.boolQuery().should(list);
    //logger.debug('translateValueTerms bq '+util.inspect(bq, false, null, true));
    return bq;
}

const translateGeoLoc = async (agg,isCrowdAgg) => {
    //logger.debug('translateGeoLoc '+util.inspect(agg, false, null, true));
    let latitude = agg.lat;
    let longitude = agg.long;
    let field = agg.field;
    if(agg.zipcode) {
        //logger.debug('Doing a geolookup of zip');
        const loc = zg.zip2geo('27540');
        latitude = loc.latitude;
        longitude = loc.longitude;
        field = isCrowdAgg ? 'fm_locations' : 'locations'; // This is a hack because of bad data that had 'location' as the field.
    }
    let query = await esb.geoDistanceQuery()
        .field(field)
        .distance(agg.radius+'km')
        .geoPoint(esb.geoPoint().lat(latitude).lon(longitude));
    logger.debug('translateGeoLoc query '+util.inspect(query, false, null, true));
    return query;
}

const getFieldName = (agg,isCrowdAgg) => {
    return isCrowdAgg ? 'fm_'+agg.field : agg.field;
}

const translateAgg = (criteria,json) => {

    let aggList = criteria.aggFilters.map( af => {
        console.log(util.inspect(af, false, null, true));
        let t = {};
        t[af.field] = {value: af.values[0]};

        return {
            bool: {
                filter: [
                    {
                        bool: {
                            should: [
                                {
                                    bool: {
                                        filter: [
                                            {
                                                term: t
                                            }
                                        ]
                                    }
                                }                                
                            ]
                        }
                    }
                ]
            }
        }

        });

    let crowdAggList = criteria.crowdAggFilters.map( af => {
        console.log(af.field)
        return {
            bool: {
                filter: [
                    {
                        term: {
                            fm_tags: {
                                value: af.field
                            }
                        }
                    }
                ]
            }
        };
        });

    let aggs = {
        front_matter_keys: {
            filter: {
                bool: {
                    must: [
                        {
                            bool: {
                                must: aggList
                            }
                        }
                    ]
                }
            },

            aggs:{
                front_matter_keys:{
                   terms:{
                      field:"front_matter_keys",
                      size:1000000,
                      order:{
                         _term:"asc"
                      },
                      missing:"-99999999999"
                   },
                   aggs:{
                      agg_bucket_sort:{
                         bucket_sort:{
                            from:0,
                            size:100,
                            sort:[
                               
                            ]
                         }
                      }
                   }
                }
             }
                         
        }
    };
    json.aggs = aggs;   
}

function injectAggs(criteria,json) {
    let aggList = criteria.aggFilters.map( af => {
        console.log(util.inspect(af, false, null, true));
        let t = {};
        t[af.field] = {value: af.values[0]};

        return {
            bool: {
                filter: [
                    {
                        bool: {
                            should: [
                                {
                                    bool: {
                                        filter: [
                                            {
                                                term: t
                                            }
                                        ]
                                    }
                                }                                
                            ]
                        }
                    }
                ]
            }
        }

    });

    let aggs = {};
    ENABLED_AGGS.forEach( enabledAgg => {

        aggs[enabledAgg] = {
            filter: {
                bool: {
                    must: [
                        {
                            bool: {
                                must: aggList
                            }
                        }
                    ]
                }
            }
        }
    });
    json.aggs = aggs;       
}
