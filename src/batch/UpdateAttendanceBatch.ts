if (process.env.DOT_ENV_PATH) {
  require('dotenv').config({ path: process.env.DOT_ENV_PATH });
}

import 'reflect-metadata';
import moment from 'moment-timezone';
import { closeDb, connDb } from '../configDb';
import { CrewRepository } from '../repository/CrewRepository';
import { AttendanceRepository } from '../repository/AttendanceRepository';
import { MessageArchiveRepository } from '../repository/MessageArchiveRepository';

class UpdateAttendanceBatch {
  public static async runBatch() {
    await connDb();

    const crewInfo = await CrewRepository.getCurrentCrewInfo()

    const userList = await MessageArchiveRepository.getYesterdayAttendedUserList();
    for (const { userId, userName, userEmail } of userList) {
      if (await AttendanceRepository.hasAttendanceByUserIdAndCrewId(userId, crewInfo.id)) continue;

      await AttendanceRepository.insertAttendanceNew({
        crewId: crewInfo.id,
        crewName: crewInfo.crewName,
        userId,
        userName,
        userEmail,
      })
    }

    const week = Math.floor(moment().diff(moment(crewInfo.startYmd), 'days')/7)+1
    const col = `week${week}x${moment().day() <= 3 ? '1' : '2'}`
    await AttendanceRepository.updateAttendanceWeek(crewInfo.id, col)

    await closeDb();
  }
}

UpdateAttendanceBatch.runBatch()
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
