// https://www.freecodecamp.org/portuguese/news/como-ativar-a-sintaxe-da-es6-e-alem-com-node-e-express/

import createError from 'http-errors';
import express from 'express';
import cors from 'cors';


import routes from './src/routes';
import prepareComponents from './src/components/prepareComponents';
import log from './src/utils/log';
import appMiddleware from './src/utils/appMiddleware';
import auditMiddleware from './src/utils/auditMiddleware';
import errorHandler from './src/errorHandler';


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
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/assets/fontawesome/svgs/solid', express.static(__dirname + '/assets/fontawesome/svgs/solid'));
app.use(appMiddleware());
app.use(auditMiddleware());
app.use(log.middleware());

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

app.use(errorHandler);

export default app;
