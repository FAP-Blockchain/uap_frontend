/**
 * Slot Types
 * Based on Fap.Domain.DTOs.Slot
 */

export interface SlotDto {
  id: string;
  classId: string;
  classCode: string;
  subjectName: string;
  teacherName: string;
  date: string;
  timeSlotId?: string;
  timeSlotName?: string;
  startTime?: string;
  endTime?: string;
  substituteTeacherId?: string;
  substituteTeacherName?: string;
  substitutionReason?: string;
  status: string;
  notes?: string;
  hasAttendance: boolean;
  totalAttendances: number;
  presentCount: number;
  absentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlotRequest {
  classId: string;
  date: string;
  timeSlotId?: string;
  substituteTeacherId?: string;
  substitutionReason?: string;
  notes?: string;
}

export interface UpdateSlotRequest {
  date: string;
  timeSlotId?: string;
  substituteTeacherId?: string;
  substitutionReason?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  notes?: string;
}

export interface SlotFilterRequest {
  classId?: string;
  teacherId?: string;
  fromDate?: string;
  toDate?: string;
  status?: "Scheduled" | "Completed" | "Cancelled";
  hasAttendance?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface UpdateSlotStatusRequest {
  status: "Scheduled" | "Completed" | "Cancelled";
  notes?: string;
}


