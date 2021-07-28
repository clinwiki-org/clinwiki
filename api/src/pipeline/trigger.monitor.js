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
    // { name:'crowd_keys', callback: indexCrowdKeys },
    // { name:'crowd_values', callback: indexCrowdValues},
];

const handleTableEvent = async (data) => {
    console.log(data);
};

export const initMonitorTriggers = async () => {
    TABLES_TO_MONITOR.forEach( async table => {
        try {
            const insertTriggerName = 'notify_pipeline_'+table.name+'_INSERT';
            const updateTriggerName = 'notify_pipeline_'+table.name+'_UPDATE';
            const deleteTriggerName = 'notify_pipeline_'+table.name+'_DELETE';

            let checkResults = await query(CHECK_TABLE_TRIGGER_QUERY,[table.name]);
            console.log("TRIGGER COUNT", checkResults.rowCount)
            if(checkResults.rowCount === 0) {
                logger.info('Creating triggers for '+table.name);
                const functionName = 'notify_'+table.name+'_event()';
                const deleteFunctionName = 'notify_'+table.name+'_delete_event()';
                const eventName = table.name+'_event';
                const something = '{"trigger": "delete" }'
                const something2 = '{"trigger": "insert" }'
                const CREATE_NOTIFY_FUNCTION_QUERY = `
                CREATE OR REPLACE FUNCTION `+functionName+`
                    RETURNS trigger
                    LANGUAGE plpgsql
                AS $function$
                BEGIN
                PERFORM pg_notify('`+eventName+`',json_build_array(to_json('`+something2+`'::text), row_to_json(NEW)::text) ::text);
                    RETURN NULL;
                END;
                $function$
                `;

                const CREATE_DELETE_NOTIFY_FUNCTION_QUERY = `
                CREATE OR REPLACE FUNCTION `+deleteFunctionName+`
                    RETURNS trigger
                    LANGUAGE plpgsql
                AS $function$
                BEGIN
                    PERFORM pg_notify('`+eventName+`',json_build_array(to_json('`+something+`'::text), row_to_json(OLD)::text) ::text);
                    RETURN NULL;
                END;
                $function$
                `;

                let createFunctionResults = await query(CREATE_NOTIFY_FUNCTION_QUERY,[]);
                let deleteFunctionResults = await query(CREATE_DELETE_NOTIFY_FUNCTION_QUERY,[]);

                const CREATE_TABLE_INSERT_TRIGGER_QUERY = `CREATE TRIGGER ${insertTriggerName} AFTER INSERT ON ${table.name} FOR EACH ROW EXECUTE PROCEDURE ${functionName};`;
                const createInsertTriggerResults = await query(CREATE_TABLE_INSERT_TRIGGER_QUERY,[]);
                                
                const CREATE_TABLE_UPDATE_TRIGGER_QUERY = "create trigger "+updateTriggerName+" after update on "+table.name+" for each row execute procedure "+functionName;
                const createUpdateTriggerResults = await query(CREATE_TABLE_UPDATE_TRIGGER_QUERY,[]);
    
                const CREATE_TABLE_DELETE_TRIGGER_QUERY = `CREATE TRIGGER ${deleteTriggerName} AFTER DELETE ON ${table.name} FOR EACH ROW EXECUTE PROCEDURE ${deleteFunctionName};`;
                const createDeleteTriggerResults = await query(CREATE_TABLE_DELETE_TRIGGER_QUERY,[]);                
                logger.info('Created triggers for '+table.name+' DONE');

            }

//  WILL NEED TO RUN THIS DROP AFTER DEPLOYING TO HAVE CHANGES TAKE PLACE 

// DROP TRIGGERS
            if(checkResults.rowCount == 2)     
            {
                console.log("About to Drop 2 triggers ")
            //    const DROP_DELETE_TRIGGER = `DROP TRIGGER ${deleteTriggerName} on ${table.name};`;
            //    const dropTriggerResults = await query(DROP_DELETE_TRIGGER);
               const INSERT_DELETE_TRIGGER = `DROP TRIGGER ${insertTriggerName} on ${table.name};`;
               const insertTriggerResults = await query(INSERT_DELETE_TRIGGER);
               const UPDATE_DELETE_TRIGGER = `DROP TRIGGER ${updateTriggerName} on ${table.name};`;
               const updateTriggerResults = await query(UPDATE_DELETE_TRIGGER);
            }

// END DROP
        }
        catch(err) {
            logger.error(err);
        }
    });

    // Now start listening.
    const subscriber = process.env.NODE_ENV == "production"? createSubscriber({ 
        connectionString: config.postgresUrl ,
        ssl: {
            sslmode: 'require',
            rejectUnauthorized: false
            }
        }) : createSubscriber({ connectionString: config.postgresUrl })
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

