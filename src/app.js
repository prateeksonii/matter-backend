const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');
const { notFoundHandler, errorHandler } = require('./middlewares');
const router = require('./routes');

const app = express();

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true,
    // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red). // optional: allows to skip some log messages based on request and/or response
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
// app.use(morgan('combined'));
app.use(cors({ origin: ['http://localhost:3000'] }));

app.use('/api/v1', router);

app.use(notFoundHandler);
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);
app.use(errorHandler);

module.exports = app;
