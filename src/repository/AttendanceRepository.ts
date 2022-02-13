import { CrewEntity } from './../entity/CrewEntity';
import _ from 'lodash';
import moment from 'moment-timezone';
import { getRepository, InsertResult } from "typeorm"
import { ATTENDANCE_STATUS } from '../common/status';
import { AttendanceEntity } from '../entity/AttendanceEntity';
import { AttendanceNewType, AttendanceInterface } from '../interface/AttendanceInterface';
import { MessageArchiveEntity } from '../entity/MessageArchiveEntity';

export class AttendanceRepository {

  public static async hasAttendanceByUserIdAndCrewId(userId: string, crewId: string): Promise<boolean> {
    const cnt = await getRepository(AttendanceEntity).count({ userId, crewId })
    return cnt > 0;
  }

  public static async getAttendance(userId: string, crewId: string): Promise<AttendanceInterface> {
    return await getRepository(AttendanceEntity).findOne({ userId, crewId })
  }

  public static async updateAttendanceUserName(userId: string, crewId: string, userName: string): Promise<void> {
    await getRepository(AttendanceEntity).update({ userId, crewId }, { userName })
  }

  public static async insertAttendanceNew(params: AttendanceNewType): Promise<string> {
    const result: InsertResult = await getRepository(AttendanceEntity).insert(params);
    return _.get(result, 'identifiers[0].id');
  }

  public static async updateAttendanceWeek(crewId: string, colName: string): Promise<void> {
    const messageArchive = await getRepository(MessageArchiveEntity).findOne({ order: { id: 'DESC' }})
    const lastMessageArchiveId = messageArchive?.id || '0';

    const crewInfo = await getRepository(CrewEntity).findOne(crewId)

    await getRepository(AttendanceEntity).createQueryBuilder('attendance')
      .update()
      .set({ [colName]: ATTENDANCE_STATUS.LATE })
      .where(`user_id IN (
        SELECT user_id FROM tb_message_archive
        WHERE crew_id = ${crewId}
        AND id > ${crewInfo.lastMessageArchiveId}
        AND id <= ${lastMessageArchiveId}
        AND is_attended = 0
      )`)
      .execute();

    await getRepository(AttendanceEntity).createQueryBuilder('attendance')
      .update()
      .set({ [colName]: ATTENDANCE_STATUS.ATTENDED })
      .where(`user_id IN (
        SELECT user_id FROM tb_message_archive
        WHERE crew_id = ${crewId}
        AND id > ${crewInfo.lastMessageArchiveId}
        AND id <= ${lastMessageArchiveId}
        AND is_attended = 1
      )`)
      .execute();

    await getRepository(AttendanceEntity).createQueryBuilder('attendance')
      .update()
      .set({ [colName]: ATTENDANCE_STATUS.ABSENT })
      .where(`${colName} = :none`, { none: ATTENDANCE_STATUS.NONE })
      .execute();

    crewInfo.lastMessageArchiveId = lastMessageArchiveId;
    await getRepository(CrewEntity).save(crewInfo);
  }

}
