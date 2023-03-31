
const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/app.log',
      maxsize: 1024 * 1024 * 10, // 10MB
      maxFiles: 5
    })
  ]
});

module.exports = {
    logger
}