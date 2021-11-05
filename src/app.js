const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { notFoundHandler, errorHandler } = require('./middlewares');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan('common'));
app.use(cors({ origin: ['http://localhost:3000'] }));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
