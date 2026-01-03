import log4js from 'log4js';

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%m' // Just output the message (JSON)
      }
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'info'
    }
  }
});

const logger = log4js.getLogger();

export function logUserActivity(userId, action, ipAddress) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    ipAddress
  };
  logger.info(JSON.stringify(logEntry));
}

export default logger;

