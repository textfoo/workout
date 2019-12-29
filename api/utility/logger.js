const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const _format = printf(({ level, message, label, timestamp }) => {
    return `${level}: ${message}`;
  });

const logger = winston.createLogger({
    level : 'debug', 
    format : combine(
        winston.format.colorize({ all: true}),
        _format
    ),
    //probably want to create a transport that logs to file....
    transports: [new winston.transports.Console({
        prettyPrint: true,
        colorize: true,
        silent: false,
        timestamp: false
      })]
})

module.exports.info = (msg) => {
    logger.info(msg); 
}

module.exports.debug = (msg) => {
    logger.debug(msg); 
}

module.exports.warn = (msg) => {
    logger.warn(msg);
}

module.exports.error = (msg) => {
    logger.error(msg); 
}