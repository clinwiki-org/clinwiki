import path from 'path';
import {runScheduler} from './scheduler';
import logger from '../util/logger';
import dotenv from 'dotenv';
import {loadConfig} from '../../config';
import {initQueue} from './pipeline.queue';

                            
logger.info(" _____ _ _     _ _ _ _ _   _ ");
logger.info("|     | |_|___| | | |_| |_|_|");
logger.info("|   --| | |   | | | | | '_| |");
logger.info("|_____|_|_|_|_|_____|_|_,_|_|");
logger.info('ClinWiki data pipeline starting...');

const envPath = path.resolve(process.cwd()+'/../', '.env');
logger.info('Loading .env from '+envPath);
dotenv.config({
    path: envPath
  });
  
loadConfig();

logger.info('Initializing pipeline queue');
initQueue();
logger.info('Running...');


runScheduler();
