// https://www.freecodecamp.org/portuguese/news/como-ativar-a-sintaxe-da-es6-e-alem-com-node-e-express/

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import routes from './src/routes';


import prepareComponents from './src/components/prepareComponents';
import log from './src/utils/log';
import appMiddleware from './src/utils/appMiddleware';
import getRequestId from './src/utils/getRequestId';
import auditMiddleware from './src/utils/auditMiddleware';

const requiredEnvVariables = [
  'MONGO_DB',
  'MONGO_URL',
  'USER_DEFAULT_PASSWORD',
  'JWT_PRIVATE_KEY_FILE',
  'JWT_PUBLIC_KEY_FILE'
];

if (!requiredEnvVariables.every(el => process.env.hasOwnProperty(el))) {
  console.log(`Required env variables: ${JSON.stringify(requiredEnvVariables)}`);
  process.exit(1);
};

prepareComponents({
  mongoDB: process.env.MONGO_DB,
  mongoURL: process.env.MONGO_URL
});


var app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: 200000000 }));
app.use(logger('dev'));
app.use(express.json());
app.use(appMiddleware());
app.use(auditMiddleware());
app.use(log.middleware());
app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ limit: '20000mb', extended: true }));
app.use(express.json({ limit: '20000mb' }));
app.use(cookieParser());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  let requestId = getRequestId(req);
  try {
    log.error(`Request ${requestId}. Error: ${JSON.stringify(err.message)}. Stack: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
  }
  catch (err) {
    log.error(`Request ${requestId}. Error: ${JSON.stringify(err.message)}. Failed to get error stack.`);
  };
  res.status(err.status || 500).json({ requestId, err: err.message, data: err.extraData });
});

export default app;
