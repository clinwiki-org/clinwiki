import {Client} from '@elastic/elasticsearch';
import superagent from 'superagent';
import config from '../../config';
import logger from '../util/logger';
const util = require('util')

export const query = async (body) => {
    try {
        const connection = getConnection();
        const payload = {
            index: config.elasticIndex,
            body
        };
        //console.log(util.inspect(payload, false, null, true /* enable colors */))
        const results = await connection.search(payload);
        //console.log(util.inspect(results, false, null, true /* enable colors */))
        return results;
    }
    catch(err) {
        logger.error('Error elastic.query: '+err);
        if(err.statusCode === 400) {
            console.log(err.body.error)
        }
    }
};

const getConnection = () => {
    //logger.debug('getConnection config.searchboxUrl: '+config.searchboxUrl);
    const client = new Client({
        node: config.searchboxUrl
    });
    return client;
};

export const newQuery = async (body) => {
    try {
        let encode = Buffer.from(config.elasticsearchUsername+':'+config.elasticsearchPassword)
            .toString('base64');
        console.log(encode)
        return await superagent.post(config.elasticsearchHost+'/'+config.elasticIndex+'/_search')
            .set('Authorization','Basic '+ encode)
            .send(body).then(response => response.body);
    }
    catch(err) {
        console.log(util.inspect(err, false, null, true /* enable colors */))
    }
}

export const bulkUpdateOLD = async (list) => {
    try {
        const body = list.flatMap( doc => [
            { index: { 
                _index: config.elasticIndex, 
                _type: '_doc',
                _id: doc.nct_id
            }},
            { doc, doc_as_upsert: true}
        ]);
        //logger.debug(util.inspect(body,false, null, true));
        const connection = getConnection();
        const payload = {
            index: config.elasticIndex,
            body
        };
        //console.log(util.inspect(payload, false, null, true /* enable colors */))
        await connection.bulk(payload);
        //console.log(util.inspect(results, false, null, true /* enable colors */))
        
    }
    catch(err) {
        logger.error('Error elastic.query: '+err);
        if(err.statusCode === 400) {
            console.log(err.body.error)
        }
    }
};

export const bulkUpsert = async (list) => {
    try {
        let body = '';
        list.forEach( doc => {
            body = body.concat(JSON.stringify(
                { index: { 
                    _index: config.elasticIndex, 
                    _type: '_doc',
                    _id: doc.nct_id
                }}
            ));
            body = body.concat("\n");
            body = body.concat(JSON.stringify({ doc, doc_as_upsert: true}))
            body = body.concat("\n");
        });

        //logger.debug(util.inspect(body,false, null, true));
        //logger.debug(body);
        let encode = Buffer.from('elastic:changeme')
            .toString('base64');
        return await superagent.post('http://localhost:9200/_bulk')
            .set('Authorization','Basic '+ encode)
            .set('Content-Type', 'application/json')
            .send(body).then(response => response.body);
        
    }
    catch(err) {
        logger.error('Error elastic.query: '+err);
        if(err.statusCode === 400) {
            console.log(err.body.error)
        }
    }
};

export const bulkUpdate = async (list) => {
    try {
        let body = '';
        list.forEach( doc => {
            body = body.concat(JSON.stringify(
                { update: { 
                    _index: config.elasticIndex, 
                    _type: '_doc',
                    _id: doc.nct_id
                }}
            ));
            body = body.concat("\n");
            body = body.concat(JSON.stringify({ doc, doc_as_upsert: false}))
            body = body.concat("\n");
        });

        //logger.debug(util.inspect(body,false, null, true));
        logger.debug('BODY')
        logger.debug(body);
        let encode = Buffer.from('elastic:changeme')
            .toString('base64');
        return await superagent.post('http://localhost:9200/_bulk')
            .set('Authorization','Basic '+ encode)
            .set('Content-Type', 'application/json')
            .send(body).then(response => response.body);
        
    }
    catch(err) {
        logger.error('Error elastic.query: '+err);
        if(err.statusCode === 400) {
            console.log(err.body.error)
        }
    }
};
