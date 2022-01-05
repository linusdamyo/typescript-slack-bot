import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageHashtagMapEntity } from './MessageHashtagMapEntity';
import { HashtagInterface } from '../interface/HashtagInterface';

@Entity('tb_hashtag')
export class HashtagEntity implements HashtagInterface {

  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'hashtag_name' })
  hashtagName: string;

  @Column({ name: 'in_use' })
  inUse: boolean;

  @CreateDateColumn({ name: 'reg_date' })
  regDate: Date;

  @OneToMany(() => MessageHashtagMapEntity, _ => _.hashtagInfo)
  messageHashtagMapInfoList: MessageHashtagMapEntity[];

}
