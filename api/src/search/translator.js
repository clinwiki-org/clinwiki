import logger from '../util/logger';
import config from '../../config';
const util = require('util');
const esb = require('elastic-builder');
const zg = require('zip2geo');

const translate = async (criteria,lastDate) => {
    logger.debug('translate.lastDate '+lastDate);

    let boolQuery = esb.boolQuery();
    
    await translateAggFilters(criteria.agg_filters,boolQuery,false);
    await translateAggFilters(criteria.crowd_agg_filters,boolQuery,true);

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
    let requestBody = esb.requestBodySearch().query( boolQuery ).from(0).size(config.elasticMaxResults);

    return requestBody.toJSON();
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
    logger.debug('translateRangeTerm '+agg);
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
        logger.debug('valQuery '+util.inspect(valQuery, false, null, true));
        list.push(valQuery); 
    });
    let bq = esb.boolQuery().should(list);
    logger.debug('translateValueTerms bq '+util.inspect(bq, false, null, true));
    return bq;
}

const translateGeoLoc = async (agg,isCrowdAgg) => {
    logger.debug('translateGeoLoc '+util.inspect(agg, false, null, true));
    let latitude = agg.lat;
    let longitude = agg.long;
    let field = agg.field;
    if(agg.zipcode) {
        logger.debug('Doing a geolookup of zip');
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
export default translate;