if (process.env.DOT_ENV_PATH) {
  require('dotenv').config({ path: process.env.DOT_ENV_PATH });
}

import 'reflect-metadata';
import moment from 'moment-timezone';
import { closeDb, connDb } from '../configDb';
import { SlackWebClient } from '../library/SlackWebClient';
import { MessageArchiveRepository } from '../repository/MessageArchiveRepository';

class SendMessageAttendedBatch {
  public static async runBatch() {
    await connDb();

    const userList = await MessageArchiveRepository.getYesterdayAttendedUserList();
    await SlackWebClient.sendMessageAttended(userList.length > 0 ? `${moment.tz('Asia/Seoul').add(-1, 'days').format('M월 D일 (ddd)')} 출석 명단\n${userList.map(u => u.userName).join('\n')}` : '아무도 안함');

    await closeDb();
  }
}

SendMessageAttendedBatch.runBatch()
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
