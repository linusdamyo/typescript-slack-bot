import _ from 'lodash';
import { EntityManager, getRepository } from "typeorm"
import { HashtagEntity } from "../entity/HashtagEntity"
import { HashtagInfoType } from "../interface/HashtagInterface"
import { MessageHashtagMapEntity } from '../entity/MessageHashtagMapEntity';

export class HashtagRepository {

  public static async getHashtagInfoList(): Promise<HashtagInfoType[]> {
    return await getRepository(HashtagEntity).find({ inUse: true })
  }

  public static async insertHashtagMap(entityManager: EntityManager, messageArchiveId: string, message: string): Promise<void> {
    const hashtagInfoList = await HashtagRepository.getHashtagInfoList()
    if (_.isEmpty(hashtagInfoList)) return;

    const hashtagList = message?.match(/\s#\S+/g)?.map(_=>_.trim())
    if (!hashtagList) return;

    for (const hashtag of hashtagList) {
      const hashtagInfo = _.find(hashtagInfoList, (hashtagInfo) => hashtagInfo.hashtagName === hashtag)
      if (hashtagInfo) {
        await entityManager.insert(MessageHashtagMapEntity, {
          messageArchiveId,
          hashtagId: hashtagInfo.id,
        })
      }
    }
  }

  public static async deleteAllHashTagMapByMessageArchiveId(entityManager: EntityManager, messageArchiveId: string): Promise<void> {
    await entityManager.delete(MessageHashtagMapEntity, { messageArchiveId });
  }

}
