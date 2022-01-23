if (process.env.DOT_ENV_PATH) {
  require('dotenv').config({ path: process.env.DOT_ENV_PATH });
}

import 'reflect-metadata';
import fs from 'fs';
import express from 'express';
import { createServer } from 'http';
import https from 'https';
import { closeDb, configDb } from './configDb';
import SlackEventController from './slack_event/SlackEventController';

const app = express();

configDb();

app.use('/slack/events', SlackEventController.requestListener());

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Server Error!');
});

const server = createServer(app).listen(Number(process.env.PORT) || 18000, () => {
  console.log(`run slack bot PORT: ${Number(process.env.PORT) || 18000}`);
});

// let httpsServer;

if (process.env.NODE_ENV === 'production') {
  // const pemPath = '/etc/letsencrypt/live/wandookongproject.com';
  // const privateKey = fs.readFileSync(`${pemPath}/privkey.pem`, 'utf8');
  // const certificate = fs.readFileSync(`${pemPath}/cert.pem`, 'utf8');
  // const ca = fs.readFileSync(`${pemPath}/chain.pem`, 'utf8');

  // const credentials = {
  //   key: privateKey,
  //   cert: certificate,
  //   ca: ca
  // };

  // httpsServer = https.createServer(credentials, app).listen(443, () => {
  //   console.log('HTTPS server running on PORT 443');
  // });
}

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  // httpsServer.close(() => {
  //   console.log('HTTPS server closed')
  //   closeDb()
  //   .then(() => {
  //     console.log('DB disconnected.')
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   })
  // })
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
