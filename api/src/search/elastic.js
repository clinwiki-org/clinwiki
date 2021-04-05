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