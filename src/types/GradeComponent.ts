/**
 * Grade Component Types
 * Based on Fap.Domain.DTOs.GradeComponent
 */

export interface GradeComponentDto {
  id: string;
  subjectId: string;
  name: string;
  weightPercent: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGradeComponentRequest {
  subjectId: string;
  name: string;
  weightPercent: number;
}

export interface UpdateGradeComponentRequest extends CreateGradeComponentRequest {}

export interface GradeComponentCommandResult {
  success: boolean;
  gradeComponentId?: string;
  errors?: string[];
}


