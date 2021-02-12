import {createLogger,transports,format} from 'winston';
import serverConfig from '../../config';

const split = require('split');

var options = {
    file: {
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
              }),
            format.uncolorize(),
            format.json()
        ),
        level: 'info',
        filename: serverConfig.logDir+'/info.log',
        handleExceptions: true,
        maxsize: 5242880, //5mb
        maxFiles: 10
    },
    console: {
        format: format.combine(
            format.colorize(),
            format.simple()),        
        level: 'debug',
        handleExceptions: true
    }
};


let logger = createLogger({
    format: format.combine(        
        format.errors({ stack: true }),
        format.splat()
      ),
    transports: [
        new transports.Console(options.console),
        new transports.File(options.file)

    ],
    exitOnError: false
});

/*
logger.stream = {
    write: (message,encoding) => logger.info(message)
}
*/
logger.stream = split().on('data', message => logger.info(message));

export default logger;
