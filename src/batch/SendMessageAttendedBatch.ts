if (process.env.DOT_ENV_PATH) {
  require('dotenv').config({ path: process.env.DOT_ENV_PATH });
}

import 'reflect-metadata';
import { closeDb, configDb } from '../configDb';
import { SlackWebClient } from '../services/SlackWebClient';

class SendMessageAttended {
  public static async runBatch() {
    await configDb();
    await SlackWebClient.sendMessageAttended('U02CLSBF280', '블라블라');
    await closeDb();
  }
}

SendMessageAttended.runBatch()
.then(() => {
  console.log('batch done.')
  process.exit(0);
})
.catch((error) => {
  console.log('batch error.')
  console.log(error);
  console.log(error.stack);
  process.exit(1);
})
