import _ from 'lodash';
import moment from 'moment-timezone';
import { getRepository, InsertResult } from "typeorm"
import { ATTENDANCE_STATUS } from '../common/status';
import { AttendanceEntity } from '../entity/AttendanceEntity';
import { AttendanceNewType } from '../interface/AttendanceInterface';

export class AttendanceRepository {

  public static async hasAttendanceByUserIdAndCrewId(userId: string, crewId: string): Promise<boolean> {
    const cnt = await getRepository(AttendanceEntity).count({ userId, crewId })
    return cnt > 0;
  }

  public static async insertAttendanceNew(params: AttendanceNewType): Promise<string> {
    const result: InsertResult = await getRepository(AttendanceEntity).insert(params);
    return _.get(result, 'identifiers[0].id');
  }

  public static async updateAttendanceWeek(crewId: string, colName: string): Promise<void> {
    await getRepository(AttendanceEntity).createQueryBuilder('attendance')
      .update()
      .set({ [colName]: ATTENDANCE_STATUS.ATTENDED })
      .where(`user_id IN (
        SELECT user_id FROM tb_message_archive
        WHERE reg_date >= '${moment.tz('Asia/Seoul').add(-1,'day').format('YYYY-MM-DD 00:00:00')}'
        AND reg_date <= '${moment.tz('Asia/Seoul').format('YYYY-MM-DD 23:59:59')}'
        AND crew_id = ${crewId}
        AND is_attended = 1
      )`)
      .execute();

    await getRepository(AttendanceEntity).createQueryBuilder('attendance')
      .update()
      .set({ [colName]: ATTENDANCE_STATUS.ABSENT })
      .where(`user_id NOT IN (
        SELECT user_id FROM tb_message_archive
        WHERE reg_date >= '${moment.tz('Asia/Seoul').add(-1,'day').format('YYYY-MM-DD 00:00:00')}'
        AND reg_date <= '${moment.tz('Asia/Seoul').format('YYYY-MM-DD 23:59:59')}'
        AND crew_id = ${crewId}
        AND is_attended = 1
      )`)
      .execute();
  }

}
