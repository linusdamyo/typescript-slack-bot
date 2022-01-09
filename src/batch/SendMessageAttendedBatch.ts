if (process.env.DOT_ENV_PATH) {
  require('dotenv').config({ path: process.env.DOT_ENV_PATH });
}

import 'reflect-metadata';
import { closeDb, connDb } from '../configDb';
import { SlackWebClient } from '../services/SlackWebClient';
import { MessageArchiveService } from '../services/MessageArchiveService';

class SendMessageAttended {
  public static async runBatch() {
    await connDb();
    const userList = await MessageArchiveService.getYesterdayAttendedUserList();
    console.log('userList');
    console.log(userList);
    await SlackWebClient.sendMessageAttended('U02CLSBF280', userList.length > 0 ? userList.join('\n') : '아무도 안함');
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
