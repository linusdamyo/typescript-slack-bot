import _ from 'lodash';
import { getRepository, InsertResult } from "typeorm"
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

}
