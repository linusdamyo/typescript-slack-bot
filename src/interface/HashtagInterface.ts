import { MessageHashtagMapInterface } from './MessageHashtagMapInterface';

export interface HashtagInterface {
  id: string;
  hashtagName: string;
  inUse: boolean;
  regDate: Date;
  messageHashtagMapInfoList: MessageHashtagMapInterface[]
}

export type HashtagRequestType = Pick<HashtagInterface, 'hashtagName'|'inUse'>
export type HashtagInfoType = Omit<HashtagInterface, 'messageHashtagMapInfoList'>
