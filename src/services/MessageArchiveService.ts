import _ from 'lodash';
import moment from 'moment-timezone';
import { EntityManager, getManager, InsertResult } from "typeorm";
import { MessageArchiveRequestType, MessageArchiveInfoType } from '../interface/MessageArchiveInterface';
import { MessageArchiveEntity } from '../entity/MessageArchiveEntity';
import { MessageTrashEntity } from '../entity/MessageTrashEntity';

export class MessageArchiveService {

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
    // 화 ~ 수 02시
    if (day === 2 || (day === 3 && hour <= 2)) {
      return true;
    }
    // 목 ~ 금 02시
    if (day === 4 || (day === 5 && hour <= 2)) {
      return true;
    }
    return false;
  }

}
