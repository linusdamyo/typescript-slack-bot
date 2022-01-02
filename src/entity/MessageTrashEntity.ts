import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MessageTrashInterface } from '../interface/MessageArchiveInterface';

@Entity('tb_message_trash')
export class MessageTrashEntity implements MessageTrashInterface {

  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'message_archive_id', type: 'bigint' })
  messageArchiveId: string;

  @Column({ name: 'channel_name' })
  channelName: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'message' })
  message: string;

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

}
