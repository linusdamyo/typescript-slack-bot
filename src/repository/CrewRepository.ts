import _ from 'lodash';
import { getRepository } from "typeorm"
import { CrewEntity } from './../entity/CrewEntity';

export class CrewRepository {

  public static async getCrewIdByCrewName(crewName: string): Promise<string> {
    const crewInfo = await getRepository(CrewEntity).findOne({ crewName })
    return crewInfo?.id || '0';
  }

}
