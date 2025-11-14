/**
 * Subject Types
 * Type definitions for Subject API requests and responses
 * Based on backend DTOs in Fap.Domain.DTOs.Subject
 */

// ==================== Request Types ====================

export interface GetSubjectsRequest {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  semesterId?: string; // UUID
  sortBy?: string; // "SubjectCode" | "SubjectName" | "Credits"
  isDescending?: boolean;
}

// ==================== Response Types ====================

export interface SubjectDto {
  id: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  semesterId: string;
  semesterName: string;
  totalClasses: number;
}

export interface PagedSubjectsResponse {
  data: SubjectDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

