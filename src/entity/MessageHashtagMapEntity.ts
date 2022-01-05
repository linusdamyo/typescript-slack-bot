import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { MessageHashtagMapInterface } from '../interface/MessageHashtagMapInterface';
import { MessageArchiveEntity } from './MessageArchiveEntity';
import { HashtagEntity } from './HashtagEntity';

@Entity('tb_message_hashtag_map')
export class MessageHashtagMapEntity implements MessageHashtagMapInterface {

  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'message_archive_id', type: 'bigint' })
  messageArchiveId: string;

  @Column({ name: 'hashtag_id', type: 'bigint' })
  hashtagId: string;

  @CreateDateColumn({ name: 'reg_date' })
  regDate: Date;

  @ManyToOne(() => MessageArchiveEntity, _ => _.messageHashtagMapInfoList)
  @JoinColumn({ name: 'message_archive_id', referencedColumnName: 'id' })
  messageArchiveInfo: MessageArchiveEntity;

  @ManyToOne(() => HashtagEntity, _ => _.messageHashtagMapInfoList)
  @JoinColumn({ name: 'hashtag_id', referencedColumnName: 'id' })
  hashtagInfo: HashtagEntity;

}
