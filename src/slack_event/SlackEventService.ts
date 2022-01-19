import { EntityManager, getManager } from 'typeorm';
import { SlackMessageChangedInterface, SlackMessageNewInterface, SlackMessageDeletedInterface, SlackMessageChannelJoinInterface } from '../interface/SlackMessageInterface';
import { SlackWebClient } from '../library/SlackWebClient';
import { MessageArchiveRepository } from '../repository/MessageArchiveRepository';
import { HashtagRepository } from '../repository/HashtagRepository';
import { CrewRepository } from '../repository/CrewRepository';
import { AttendanceRepository } from '../repository/AttendanceRepository';

export class SlackEventService {

  public static async processMessageNew(event: SlackMessageNewInterface): Promise<void> {
    if (!event.client_msg_id) return;
    if (!event.text) return;

    const [channelName, crewName] = await SlackWebClient.getChannelName(event.channel)
    const userInfo = await SlackWebClient.getUserInfo(event.user)
    if (userInfo === null) return;

    const isAttended = await MessageArchiveRepository.checkIsAttended(event.event_ts)
    const crewId = await CrewRepository.getCrewIdByCrewName(crewName)

    await getManager().transaction(async (entityManager: EntityManager) => {
      const messageArchiveId = await MessageArchiveRepository.insertMessage(entityManager, {
        channelName,
        crewId,
        crewName,
        userName: userInfo[0],
        userEmail: userInfo[1],
        isAttended,
        message: event.text,
        clientMsgId: event.client_msg_id,
        userId: event.user,
        channelId: event.channel,
        eventTs: event.event_ts,
      })

      await HashtagRepository.insertHashtagMap(entityManager, messageArchiveId, event.text)
    })
  }

  public static async processMessageChanged(event: SlackMessageChangedInterface): Promise<void> {
    const clientMsgId = event.message?.client_msg_id
    const messageArchiveInfo = await MessageArchiveRepository.getMessageArchiveInfoByClientMsgId(clientMsgId)
    if (!messageArchiveInfo) return;

    await getManager().transaction(async (entityManager: EntityManager) => {
      await MessageArchiveRepository.insertMessageTrash(entityManager, messageArchiveInfo)
      await MessageArchiveRepository.updateMessage(entityManager, messageArchiveInfo.id, event.message?.text)
      await HashtagRepository.deleteAllHashTagMapByMessageArchiveId(entityManager, messageArchiveInfo.id)
      await HashtagRepository.insertHashtagMap(entityManager, messageArchiveInfo.id, event.message?.text)
    })
  }

  public static async processMessageDeleted(event: SlackMessageDeletedInterface): Promise<void> {
    const clientMsgId = event.previous_message?.client_msg_id
    const messageArchiveInfo = await MessageArchiveRepository.getMessageArchiveInfoByClientMsgId(clientMsgId)
    if (!messageArchiveInfo) return;

    await getManager().transaction(async (entityManager: EntityManager) => {
      await MessageArchiveRepository.insertMessageTrash(entityManager, messageArchiveInfo)
      await MessageArchiveRepository.deleteMessage(entityManager, messageArchiveInfo.id)
    })
  }

  public static async processChannelJoin(event: SlackMessageChannelJoinInterface): Promise<void> {
    const crewInfo = await CrewRepository.getCurrentCrewInfo()
    console.log(crewInfo.crewName)
    if (!crewInfo) return;

    if (await AttendanceRepository.hasAttendanceByUserIdAndCrewId(event.user, crewInfo.id)) return;

    const userInfo = await SlackWebClient.getUserInfo(event.user)
    if (userInfo === null) return;

    await AttendanceRepository.insertAttendanceNew({
      crewId: crewInfo.id,
      crewName: crewInfo.crewName,
      userId: event.user,
      userName: userInfo[0],
      userEmail: userInfo[1],
    })
  }

}
