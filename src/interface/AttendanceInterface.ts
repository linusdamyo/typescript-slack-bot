import { ATTENDANCE_STATUS } from '../common/status';

export interface AttendanceInterface {
  id: string;
  crewId: string;
  crewName: string;
  userId: string;
  userName: string;
  week1x1: ATTENDANCE_STATUS;
  week1x2: ATTENDANCE_STATUS;
  week2x1: ATTENDANCE_STATUS;
  week2x2: ATTENDANCE_STATUS;
  week3x1: ATTENDANCE_STATUS;
  week3x2: ATTENDANCE_STATUS;
  week4x1: ATTENDANCE_STATUS;
  week4x2: ATTENDANCE_STATUS;
  week5x1: ATTENDANCE_STATUS;
  week5x2: ATTENDANCE_STATUS;
  week6x1: ATTENDANCE_STATUS;
  week6x2: ATTENDANCE_STATUS;
  week7x1: ATTENDANCE_STATUS;
  week7x2: ATTENDANCE_STATUS;
  regDate: Date;
}
