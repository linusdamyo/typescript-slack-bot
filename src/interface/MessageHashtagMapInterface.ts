import { MessageArchiveInterface } from './MessageArchiveInterface';
import { HashtagInterface } from './HashtagInterface';

export interface MessageHashtagMapInterface {
  id: string;
  messageArchiveId: string;
  hashtagId: string;
  regDate: Date;
  messageArchiveInfo: MessageArchiveInterface
  hashtagInfo: HashtagInterface
}

export type MessageHashtagMapRequestType = Pick<MessageHashtagMapInterface, 'messageArchiveId'|'hashtagId'>
