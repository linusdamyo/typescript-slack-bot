import { EntityManager, getManager } from 'typeorm';
import { SlackMessageChangedInterface, SlackNewMessageInterface, SlackMessageDeletedInterface } from '../interface/SlackMessageInterface';
import { SlackWebClient } from './SlackWebClient';
import { MessageArchiveService } from './MessageArchiveService';
import { HashtagService } from './HashtagService';

export class SlackMessageProcess {

  public static async processNewMessage(event: SlackNewMessageInterface): Promise<void> {
    const channelName = await SlackWebClient.getChannelName(event.channel)
    const userName = await SlackWebClient.getUserName(event.user)
    const isAttended = await MessageArchiveService.checkIsAttended(event.event_ts)

    await getManager().transaction(async (entityManager: EntityManager) => {
      const messageArchiveId = await MessageArchiveService.insertMessage(entityManager, {
        channelName,
        userName,
        isAttended,
        message: event.text,
        clientMsgId: event.client_msg_id,
        userId: event.user,
        channelId: event.channel,
        eventTs: event.event_ts,
      })

      await HashtagService.insertHashtagMap(entityManager, messageArchiveId, event.text)
    })
  }

  public static async processMessageChanged(event: SlackMessageChangedInterface): Promise<void> {
    const clientMsgId = event.message?.client_msg_id
    const messageArchiveInfo = await MessageArchiveService.getMessageArchiveInfoByClientMsgId(clientMsgId)

    await getManager().transaction(async (entityManager: EntityManager) => {
      await MessageArchiveService.insertMessageTrash(entityManager, messageArchiveInfo)
      await MessageArchiveService.updateMessage(entityManager, messageArchiveInfo.id, event.message?.text)
      await HashtagService.deleteAllHashTagMapByMessageArchiveId(entityManager, messageArchiveInfo.id)
      await HashtagService.insertHashtagMap(entityManager, messageArchiveInfo.id, event.message?.text)
    })
  }

  public static async processMessageDeleted(event: SlackMessageDeletedInterface): Promise<void> {
    const clientMsgId = event.previous_message?.client_msg_id
    const messageArchiveInfo = await MessageArchiveService.getMessageArchiveInfoByClientMsgId(clientMsgId)

    await getManager().transaction(async (entityManager: EntityManager) => {
      await MessageArchiveService.insertMessageTrash(entityManager, messageArchiveInfo)
      await MessageArchiveService.deleteMessage(entityManager, messageArchiveInfo.id)
    })
  }

}
