/**
 * Common Types
 * Shared pagination helpers based on backend DTOs in Fap.Domain.DTOs.Common
 */

export interface PaginationRequest {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}


