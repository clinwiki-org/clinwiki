import logger from './logger';
import config from '../../config';
import Pool from '../../node_modules/pg-pool/index';

let pool = undefined;

export const query = async (str,params) => {
    if(!pool) {
	pool = new Pool({ connectionString: config.postgresUrl });
    }
    logger.debug('Query DB: '+str+' with params: '+params);
    const res = await pool.query(str,params);
    return res;
}


