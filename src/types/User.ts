/**
 * User Types
 * Based on Fap.Domain.DTOs.User
 */

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roleName: string;
  studentCode?: string | null;
  teacherCode?: string | null;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  roleName?: string;
  studentCode?: string;
  enrollmentDate?: string;
  teacherCode?: string;
  hireDate?: string;
  specialization?: string;
  phoneNumber?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  userId?: string;
  errors?: string[];
}

export interface GetUsersRequest {
  roleName?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}


