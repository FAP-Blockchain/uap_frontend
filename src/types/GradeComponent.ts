/**
 * Grade Component Types
 * Based on Fap.Domain.DTOs.GradeComponent
 */

export interface GradeComponentDto {
  id: string;
  name: string;
  weightPercent: number;
  gradeCount: number;
}

export interface CreateGradeComponentRequest {
  name: string;
  weightPercent: number;
}

export interface UpdateGradeComponentRequest {
  name: string;
  weightPercent: number;
}

export interface GradeComponentResponse {
  success: boolean;
  message: string;
  gradeComponentId?: string;
  errors?: string[];
}


