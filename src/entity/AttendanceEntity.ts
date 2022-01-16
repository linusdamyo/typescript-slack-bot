import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ATTENDANCE_STATUS } from '../common/status';
import { AttendanceInterface } from '../interface/AttendanceInterface';

@Entity('tb_attendance')
export class AttendanceEntity implements AttendanceInterface {

  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'crew_id' })
  crewId: string;

  @Column({ name: 'crew_name' })
  crewName: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week1_1' })
  week1x1: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week1_2' })
  week1x2: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week2_1' })
  week2x1: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week2_2' })
  week2x2: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week3_1' })
  week3x1: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week3_2' })
  week3x2: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week4_1' })
  week4x1: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week4_2' })
  week4x2: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week5_1' })
  week5x1: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week5_2' })
  week5x2: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week6_1' })
  week6x1: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week6_2' })
  week6x2: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week7_1' })
  week7x1: ATTENDANCE_STATUS;

  @Column('enum', { enum: ATTENDANCE_STATUS, name: 'week7_2' })
  week7x2: ATTENDANCE_STATUS;

  @CreateDateColumn({ name: 'reg_date' })
  regDate: Date;

}
