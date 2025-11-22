import api from "../../../config/axios";
import type { StudentCredentialDto } from "../../../types/Credential";

export interface CredentialListItem extends StudentCredentialDto {
  id: string;
}

export interface CredentialsListResponse {
  items: CredentialListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateCredentialRequest {
  studentId: string;
  templateId?: string;
  certificateType: string;
  subjectId?: string;
  semesterId?: string;
  roadmapId?: string;
  completionDate: string;
  finalGrade?: number;
  letterGrade?: string;
  classification?: string;
}

export interface CreateCredentialResponse {
  success: boolean;
  message: string;
  credentialId?: string;
}

const normalizeItems = <T>(payload: {
  data?: T[];
  items?: T[];
}): T[] => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  return [];
};

export const fetchCredentialsApi = async (
  params?: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    status?: string;
    certificateType?: string;
  }
): Promise<CredentialsListResponse> => {
  const response = await api.get<CredentialsListResponse>("/credentials", {
    params: {
      Page: params?.page,
      PageSize: params?.pageSize,
      SearchTerm: params?.searchTerm,
      Status: params?.status,
      CertificateType: params?.certificateType,
    },
  });

  const apiData = response.data;
  return {
    ...apiData,
    items: normalizeItems<CredentialListItem>(apiData),
    page: apiData.page || 1,
    totalPages:
      apiData.totalPages ||
      Math.ceil((apiData.totalCount || 0) / (apiData.pageSize || 10)),
  };
};

export const createCredentialApi = async (
  payload: CreateCredentialRequest
): Promise<CreateCredentialResponse> => {
  const response = await api.post<CreateCredentialResponse>(
    "/credentials",
    payload
  );
  return response.data;
};

export const getCredentialByIdApi = async (
  id: string
): Promise<CredentialListItem> => {
  const response = await api.get<CredentialListItem>(`/credentials/${id}`);
  return response.data;
};

export const deleteCredentialApi = async (id: string): Promise<void> => {
  await api.delete(`/credentials/${id}`);
};

