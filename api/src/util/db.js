import logger from './logger';
import config from '../../config';
import Pool from '../../node_modules/pg-pool/index';

let pool = undefined;
let aactPool = undefined;

export const query = async (str,params) => {
    if(!pool) {
	pool = new Pool({ connectionString: config.postgresUrl });
    }
    //logger.debug('Query DB: '+str+' with params: '+params);
    const res = await pool.query(str,params);
    return res;
}


export const queryAACT = async (str,params) => {
    if(!aactPool) {
	    aactPool = new Pool({ connectionString: config.aactUrl });
    }
    //logger.debug('Query DB: '+str+' with params: '+params);
    const res = await aactPool.query(str,params);
    return res;
}

