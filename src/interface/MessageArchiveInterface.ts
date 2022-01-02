import { MessageHashtagMapInterface } from './MessageHashtagMapInterface';

export interface MessageArchiveInterface {
  id: string;
  channelName: string;
  userName: string;
  message: string;
  isAttended: boolean;
  clientMsgId: string;
  userId: string;
  channelId: string;
  eventTs: string;
  regDate: Date;
  messageHashtagMapInfoList: MessageHashtagMapInterface[]
}

export type MessageArchiveRequestType = Omit<MessageArchiveInterface, 'id'|'regDate'|'messageHashtagMapInfoList'>
export type MessageArchiveInfoType = Omit<MessageArchiveInterface, 'messageHashtagMapInfoList'>

export interface MessageTrashInterface extends Omit<MessageArchiveInterface, 'isAttended'|'messageHashtagMapInfoList'> {
  messageArchiveId: string
}
