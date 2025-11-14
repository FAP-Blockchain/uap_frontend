/**
 * Grade Types
 * Type definitions for Grade API requests and responses
 * Based on backend DTOs in Fap.Domain.DTOs.Grade
 */

// ==================== Request Types ====================

export interface GetStudentGradesRequest {
  SemesterId?: string; // UUID - PascalCase to match backend
  SubjectId?: string; // UUID - PascalCase to match backend
  SortBy?: string; // "SubjectCode" | "SubjectName" | etc.
  SortOrder?: string; // "asc" | "desc"
}

// ==================== Response Types ====================

export interface ComponentGradeDto {
  gradeId: string | null;
  gradeComponentId: string;
  componentName: string;
  componentWeight: number;
  score: number | null;
  letterGrade: string | null;
}

export interface SubjectGradeDto {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  className: string | null;
  semesterName: string;
  componentGrades: ComponentGradeDto[];
  averageScore: number | null;
  finalLetterGrade: string | null;
}

export interface StudentGradeTranscriptDto {
  studentId: string;
  studentCode: string;
  studentName: string;
  email: string;
  currentGPA: number;
  subjects: SubjectGradeDto[];
}

