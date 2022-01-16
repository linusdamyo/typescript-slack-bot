import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CrewInterface } from '../interface/CrewInterface';

@Entity('tb_crew')
export class CrewEntity implements CrewInterface {

  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'crew_name' })
  crewName: string;

  @Column({ name: 'start_ymd' })
  startYmd: string;

  @Column({ name: 'end_ymd' })
  endYmd: string;

}
