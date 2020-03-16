/* eslint-disable object-curly-newline */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
// Logger
// This logger is used to show error/info messages about the status of the API
import winston from 'winston';
import moment from 'moment';
// import logSymbols from 'log-symbols';
import fs from 'fs-extra';
import { NODE_ENV } from '../config';

const transports = [];
const dir = './logs';

// Creating the logs dir if does not exist
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const colorsLevels = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
  colors: {
    emerg: 'red',
    alert: 'red',
    crit: 'red',
    error: 'red',
    warning: 'yellow',
    notice: 'blue',
    info: 'green',
    debug: 'green',
  },
};

// For development in prod need to check for dev env
// in dev we want more info error tracking
// in prod essential info error message
if (NODE_ENV.env !== 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true })),
    }),
    new winston.transports.File({
      prettyPrint: true,
      silent: false,
      timestamp: true,
      json: false,
      filename: `${dir}/logs.log`,
    }),
  );
  winston.addColors(colorsLevels);
} else {
  transports.push(new winston.transports.Console());
}

class Logger {
  static dateFormat() {
    return moment(new Date(Date.now()).toUTCString())
      .local()
      .format('YYYY-MM-DD HH:MM:ss');
  }

  constructor(route) {
    this.log_data = null;
    this.route = route;
    const loggerInstance = winston.createLogger({
      transports,
      format: winston.format.combine(
        winston.format.printf((info) => {
          let message = `${Logger.dateFormat()} | ${info.level.toUpperCase()} | ${
            info.message
          } `;
          message = info.obj
            ? `${message}data:${JSON.stringify(info.obj)} | `
            : message;
          message = this.log_data
            ? `${message}log_data:${JSON.stringify(this.log_data)} | `
            : message;
          return message;
        }),
      ),
    });
    this.loggerInstance = loggerInstance;
  }

  setLogData(logData) {
    this.log_data = logData;
  }

  async info(message, obj) {
    this.loggerInstance.log('info', `✌️ ${message} ${obj || ''}`);
  }

  async debug(message, obj) {
    this.loggerInstance.log('debug', `🔥 ${message} ${obj || ''}`);
  }

  async error(message, obj) {
    this.loggerInstance.log('error', `🔥 ${message} ${obj || ''}`);
  }
}

export default new Logger();
