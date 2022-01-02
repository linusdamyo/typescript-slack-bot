if (process.env.DOT_ENV_PATH) {
  require('dotenv').config({ path: process.env.DOT_ENV_PATH });
}

import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { closeDb, configDb } from './configDb';
import SlackEventService from './services/SlackEventService';

const app = express();

configDb();

app.use('/slack/events', SlackEventService.requestListener());

const server = createServer(app).listen(18000, () => {
  console.log('run slack bot');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    closeDb()
    .then(() => {
      console.log('DB disconnected.')
    })
    .catch(error => {
      console.log(error);
    })
  })
})
