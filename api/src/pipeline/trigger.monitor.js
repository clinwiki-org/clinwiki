import createSubscriber from "pg-listen"
import logger from '../util/logger';
import {query} from '../util/db';
import config from '../../config';
import {indexWikiPage, indexCrowdKeyValueIds, indexCrowdKeys, indexCrowdValues} from './jobs/clinwiki.triggers';
const util = require('util')

const CHECK_TABLE_TRIGGER_QUERY = "SELECT trigger_name FROM  information_schema.triggers WHERE event_object_table = $1 AND trigger_name like 'notify_pipeline%'";
const TABLES_TO_MONITOR = [
    { name:'wiki_pages', callback: indexWikiPage },
    { name:'crowd_key_value_ids', callback: indexCrowdKeyValueIds },
    { name:'crowd_keys', callback: indexCrowdKeys },
    { name:'crowd_values', callback: indexCrowdValues},
];

const handleTableEvent = async (data) => {
    console.log(data);
};

export const initMonitorTriggers = async () => {
    TABLES_TO_MONITOR.forEach( async table => {
        try {
            const insertTriggerName = 'notify_pipeline_'+table.name+'_INSERT';
            const updateTriggerName = 'notify_pipeline_'+table.name+'_UPDATE';
            let checkResults = await query(CHECK_TABLE_TRIGGER_QUERY,[table.name]);
            
            if(checkResults.rowCount === 0) {
                logger.info('Creating triggers for '+table.name);
                const functionName = 'notify_'+table.name+'_event()';
                const eventName = table.name+'_event';
                const CREATE_NOTIFY_FUNCTION_QUERY = `
                CREATE OR REPLACE FUNCTION `+functionName+`
                    RETURNS trigger
                    LANGUAGE plpgsql
                AS $function$
                BEGIN
                    PERFORM pg_notify('`+eventName+`', row_to_json(NEW)::text);
                    RETURN NULL;
                END;
                $function$
                `;
                let createFunctionResults = await query(CREATE_NOTIFY_FUNCTION_QUERY,[]);

                const CREATE_TABLE_INSERT_TRIGGER_QUERY = `CREATE TRIGGER ${insertTriggerName} AFTER INSERT ON ${table.name} FOR EACH ROW EXECUTE PROCEDURE ${functionName};`;
                const createInsertTriggerResults = await query(CREATE_TABLE_INSERT_TRIGGER_QUERY,[]);
                                
                const CREATE_TABLE_UPDATE_TRIGGER_QUERY = "create trigger "+updateTriggerName+" after update on "+table.name+" for each row execute procedure "+functionName;
                const createUpdateTriggerResults = await query(CREATE_TABLE_UPDATE_TRIGGER_QUERY,[]);
    
                logger.info('Created triggers for '+table.name+' DONE');

            }
        }
        catch(err) {
            logger.error(err);
        }
    });

    // Now start listening.
    const subscriber = createSubscriber({ connectionString: config.postgresUrl })
    TABLES_TO_MONITOR.forEach( async table => {
        const eventName = table.name+'_event';
        subscriber.notifications.on(eventName, table.callback);
        logger.info("Listening to "+eventName);
    });
    await subscriber.connect();
    TABLES_TO_MONITOR.forEach( async table => {
        const eventName = table.name+'_event';
        await subscriber.listenTo(eventName);
    });
    
};

