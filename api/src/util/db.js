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

export const queryHasura = async (str,params, hasuraInstance) => {
    console.log("HASURA QUERY", str)
    console.log("Params", params)
    console.log("Instance", hasuraInstance)

    //Seperate header needed here currently since we are hitting a container instance of hasura and cloud. Container key is kept in our dockerfile but for cloud we have to include it in the request header 
    const abc = await fetch(hasuraInstance == "studies"? config.hasuraUrl : config.hasuraUrlDIS, {
        method: 'POST',
        headers: hasuraInstance == "studies"? {
            'Content-Type': 'application/json',
            Accept: 'application/json',
         
        }: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-hasura-admin-secret': config.secretKeyDis,
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

