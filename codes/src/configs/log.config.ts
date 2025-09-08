export const logConfig = () => ({
  level: process.env.LOG_LEVEL || 'info',
  fileName: process.env.LOG_FILE_NAME || 'app-%DATE%.log',
  dirName: process.env.LOG_DIR_NAME || 'logs',
  dirPath: process.env.LOG_DIR_PATH || 'src/storage/logs',
  datePattern: process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD',
  dateFormat: process.env.LOG_DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss',
  api: {
    level: process.env.LOG_LEVEL || 'info',
    fileName: process.env.LOG_FILE_NAME || 'app-%DATE%.log',
    dateFormat: process.env.LOG_DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss',
  },
  file: {
    level: process.env.LOG_LEVEL || 'info',
    fileName: process.env.LOG_FILE_NAME || 'app-%DATE%.log',
    dirName: process.env.LOG_DIR_NAME || 'logs',
    dirPath: process.env.LOG_DIR_PATH || 'src/storage/logs',
    datePattern: process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD',
    dateFormat: process.env.LOG_DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss',
  },
  request: {
    level: process.env.LOG_LEVEL || 'info',
    fileName: process.env.LOG_FILE_NAME || 'app-%DATE%.log',
    dateFormat: process.env.LOG_DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss',
  },
  status: {
    api: process.env.LOG_STATUS_API || 'true',
    rmq: process.env.LOG_STATUS_RMQ || 'true',
  },
  useFileLog: (process.env.LOG_ENABLE_FILE_LOGGER || 'false') === 'true',
  useConsoleLog: (process.env.LOG_ENABLE_CONSOLE_LOGGER || 'true') === 'true',
});
