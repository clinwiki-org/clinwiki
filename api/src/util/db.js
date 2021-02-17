import {Pool} from 'pg';
import config from '../../config';
import logger from './logger';
    
let pool = undefined;

export const query = async (str,params) => {
    if(!pool) {
        pool = new Pool({ connectionString: config.postgresUrl });
    }
    logger.debug('Query DB: '+str+' with params: '+params);
    const res = await pool.query(str,params);
    return res;
}

