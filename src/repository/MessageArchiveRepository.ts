import { CrewEntity } from './../entity/CrewEntity';
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
      userEmail: messageArchiveInfo.userEmail,
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

  public static async checkIsAttended(channelName: string, eventTs: string): Promise<boolean> {
    const m = moment(Number(eventTs) * 1000).tz('Asia/Seoul');
    const day = m.day();
    const hour = m.hour();

    try {
      const weekSeq = channelName.split('_')[2][0]

      if (weekSeq === '1') {
        // ??? ~ ??? 02???
        if (day === 1 || day === 2 || (day === 3 && hour < 2) || (day === 3 && m.format('HH:mm:SS') === '02:00:00')) {
          return true;
        } else {
          return false;
        }
      }

      if (weekSeq === '2') {
        // ??? 03??? ~ ??? 02???
        if ((day === 3 && hour >= 3) || day === 4 || (day === 5 && hour < 2) || (day === 5 && m.format('HH:mm:SS') === '02:00:00')) {
          return true;
        } else {
        return false;
        }
      }
    } catch (err) {
    }

    return false;
  }

  public static async getYesterdayAttendedUserList(): Promise<{ userId: string, userName: string, userEmail: string}[]> {
    const startDate = moment.tz('Asia/Seoul').day() === 3
      ? moment.tz('Asia/Seoul').add(-2,'day').format('YYYY-MM-DD 00:00:00')
      : moment.tz('Asia/Seoul').add(-2,'day').format('YYYY-MM-DD 03:00:00')

    const result = await getManager().createQueryBuilder(MessageArchiveEntity, 'archive')
      .select('DISTINCT user_name', 'userName')
      .addSelect('user_id', 'userId')
      .addSelect('user_email', 'userEmail')
      .where('archive.is_attended = :isAttended', { isAttended: true })
      .andWhere('archive.reg_date >= :startDate', { startDate })
      .andWhere('archive.reg_date <= :today', { today: moment.tz('Asia/Seoul').format('YYYY-MM-DD 23:59:59') })
      .getRawMany();

    return result.map(r => ({
      userId: r.userId,
      userName: r.userName,
      userEmail: r.userEmail,
    }));
  }

  public static async getNewMessageUserList(lastMessageArchiveId: string): Promise<{ userId: string, userName: string, userEmail: string}[]> {
    const result = await getManager().createQueryBuilder(MessageArchiveEntity, 'archive')
      .select('DISTINCT user_name', 'userName')
      .addSelect('user_id', 'userId')
      .addSelect('user_email', 'userEmail')
      .where('archive.id > :lastMessageArchiveId', { lastMessageArchiveId })
      .getRawMany();

    return result.map(r => ({
      userId: r.userId,
      userName: r.userName,
      userEmail: r.userEmail,
    }));
  }

}
