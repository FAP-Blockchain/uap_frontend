/**
 * Enrollment Types
 * Based on Fap.Domain.DTOs.Enrollment
 */

export interface EnrollmentDto {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  classCode: string;
  subjectName: string;
  subjectCode: string;
  registeredAt: string;
  isApproved: boolean;
  status: string;
}

export interface EnrollmentDetailDto {
  id: string;
  registeredAt: string;
  isApproved: boolean;
  status: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentGpa: number;
  classId: string;
  classCode: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  semesterName: string;
  semesterStartDate: string;
  semesterEndDate: string;
}

export interface StudentEnrollmentHistoryDto {
  enrollmentId: string;
  classId: string;
  classCode: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  teacherName: string;
  semesterName: string;
  registeredAt: string;
  isApproved: boolean;
  status: string;
  semesterStartDate: string;
  semesterEndDate: string;
}

export interface CreateEnrollmentRequest {
  studentId: string;
  classId: string;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  enrollmentId?: string;
  errors?: string[];
}

export interface GetEnrollmentsRequest {
  classId?: string;
  studentId?: string;
  isApproved?: boolean;
  registeredFrom?: string;
  registeredTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface ApproveEnrollmentRequest {
  // placeholder for future fields
}

export interface RejectEnrollmentRequest {
  reason?: string;
}

export interface GetStudentEnrollmentsRequest {
  semesterId?: string;
  isApproved?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}


