import _ from 'lodash';
import moment from 'moment-timezone';
import { EntityManager, getManager, InsertResult } from "typeorm";
import { MessageArchiveRequestType, MessageArchiveInfoType } from '../interface/MessageArchiveInterface';
import { MessageArchiveEntity } from '../entity/MessageArchiveEntity';
import { MessageTrashEntity } from '../entity/MessageTrashEntity';

export class MessageArchiveRepository {

  public static async getMessageArchiveInfoByClientMsgId(clientMsgId: string): Promise<MessageArchiveInfoType> {
    return await getManager().findOne(MessageArchiveEntity, { where: { clientMsgId } })
  }

  public static async insertMessage(entityManager: EntityManager, params: MessageArchiveRequestType): Promise<string> {
    const result: InsertResult = await entityManager.insert(MessageArchiveEntity, params);
    return _.get(result, 'identifiers[0].id');
  }

  public static async insertMessageTrash(entityManager: EntityManager, messageArchiveInfo: MessageArchiveInfoType): Promise<string> {
    const result: InsertResult = await entityManager.insert(MessageTrashEntity, {
      messageArchiveId: messageArchiveInfo.id,
      channelName: messageArchiveInfo.channelName,
      crewId: messageArchiveInfo.crewId,
      crewName: messageArchiveInfo.crewName,
      userName: messageArchiveInfo.userName,
      message: messageArchiveInfo.message,
      clientMsgId: messageArchiveInfo.clientMsgId,
      userId: messageArchiveInfo.userId,
      channelId: messageArchiveInfo.channelId,
      eventTs: messageArchiveInfo.eventTs,
    });
    return _.get(result, 'identifiers[0].id');
  }

  public static async updateMessage(entityManager: EntityManager, messageArchiveId: string, message: string): Promise<void> {
    await entityManager.update(MessageArchiveEntity, { id: messageArchiveId }, { message });
  }

  public static async deleteMessage(entityManager: EntityManager, messageArchiveId: string): Promise<void> {
    await entityManager.delete(MessageArchiveEntity, messageArchiveId);
  }

  public static async checkIsAttended(eventTs: string): Promise<boolean> {
    const m = moment(Number(eventTs) * 1000).tz('Asia/Seoul');
    const day = m.day();
    const hour = m.hour();
    // 월 ~ 수 02시
    if (day === 1 || day === 2 || (day === 3 && hour <= 2)) {
      return true;
    }
    // 수 03시 ~ 금 02시
    if ((day === 3 && hour >= 3) || day === 4 || (day === 5 && hour <= 2)) {
      return true;
    }
    return false;
  }

  public static async getYesterdayAttendedUserList(): Promise<{ userId: string, userName: string}[]> {
    const startDate = moment.tz('Asia/Seoul').day() === 3
      ? moment.tz('Asia/Seoul').add(-2,'day').format('YYYY-MM-DD 00:00:00')
      : moment.tz('Asia/Seoul').add(-2,'day').format('YYYY-MM-DD 03:00:00')

    const result = await getManager().createQueryBuilder(MessageArchiveEntity, 'archive')
      .select('DISTINCT user_name', 'userName')
      .addSelect('user_id', 'userId')
      .where('archive.is_attended = :isAttended', { isAttended: true })
      .andWhere('archive.reg_date >= :startDate', { startDate })
      .andWhere('archive.reg_date <= :today', { today: moment.tz('Asia/Seoul').format('YYYY-MM-DD 23:59:59') })
      .getRawMany();

    return result.map(r => ({
      userId: r.userId,
      userName: r.userName
    }));
  }

}
