const winston = require("winston");
const { combine, json, errors } = winston.format;
export const logger = winston.createLogger({
  level: "info",

  format: combine(errors({ stack: true }), json()),
  transports: [new winston.transports.Console()],
});
