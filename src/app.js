const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { notFoundHandler, errorHandler } = require('./middlewares');
const router = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({ origin: ['http://localhost:3000'] }));

app.use('/api/v1', router);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
