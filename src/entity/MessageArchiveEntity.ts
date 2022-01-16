import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageHashtagMapEntity } from './MessageHashtagMapEntity';
import { MessageArchiveInterface } from '../interface/MessageArchiveInterface';

@Entity('tb_message_archive')
export class MessageArchiveEntity implements MessageArchiveInterface {

  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'channel_name' })
  channelName: string;

  @Column({ name: 'crew_id', type: 'bigint' })
  crewId: string;

  @Column({ name: 'crew_name' })
  crewName: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'message' })
  message: string;

  @Column({ name: 'is_attended' })
  isAttended: boolean;

  @Column({ name: 'client_msg_id' })
  clientMsgId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'channel_id' })
  channelId: string;

  @Column({ name: 'event_ts' })
  eventTs: string;

  @CreateDateColumn({ name: 'reg_date' })
  regDate: Date;

  @OneToMany(() => MessageHashtagMapEntity, _ => _.messageArchiveInfo)
  messageHashtagMapInfoList: MessageHashtagMapEntity[];

}
