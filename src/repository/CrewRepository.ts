import { CrewInterface } from './../interface/CrewInterface';
import _ from 'lodash';
import moment from 'moment-timezone';
import { getRepository, LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm"
import { CrewEntity } from './../entity/CrewEntity';

export class CrewRepository {

  public static async getCrewIdByCrewName(crewName: string): Promise<string> {
    const crewInfo = await getRepository(CrewEntity).findOne({ crewName })
    return crewInfo?.id || '0';
  }

  public static async getCurrentCrewInfo(): Promise<CrewInterface> {
    const today = moment().format('YYYY-MM-DD')
    const crewInfo = await getRepository(CrewEntity).findOne({
      startYmd: LessThanOrEqual(today),
      endYmd: MoreThanOrEqual(today)
    })
    return crewInfo;
  }

}
