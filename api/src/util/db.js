import logger from './logger';
import config from '../../config';
import Pool from '../../node_modules/pg-pool/index';
import { aactStudyReindex } from '../pipeline/jobs/aact.job';

let pool = undefined;
let aactPool = undefined;
const fetch = require('node-fetch');

export const query = async (str,params) => {
    if(!pool) {
	pool = process.env.NODE_ENV == "production"? new Pool({ 
        connectionString: config.postgresUrl, 
        ssl: {
            sslmode: 'require',
            rejectUnauthorized: false
          }
        }) : new Pool({ connectionString: config.postgresUrl });
    }
    //logger.debug('Query DB: '+str+' with params: '+params);
    const res = await pool.query(str,params);
    return res;
}

export const queryAACT = async (str,params) => {
    if(!aactPool) {
	    aactPool = process.env.NODE_ENV == "production"?  new Pool({ 
            connectionString: config.aactUrl,
            ssl: {
                sslmode: 'require',
                rejectUnauthorized: false
              }
            }) : new Pool({ connectionString: config.postgresUrl });
       
    }
    //logger.debug('Query DB: '+str+' with params: '+params);
    await aactPool.query("SET search_path TO 'ctgov_prod';")
    const res = await aactPool.query(str,params);
    return res;
}

export const queryHasura = async (str,params) => {
    
    const abc = await fetch(config.hasuraUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query: str,
            variables: params,
            // operationName,
        }),
    }).then(r => r.json());

    console.log("ABC", abc)
    return abc;
}

