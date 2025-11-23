import api from "../../../config/axios";
import type {
  GradeComponentDto,
  CreateGradeComponentRequest,
  UpdateGradeComponentRequest,
  GradeComponentCommandResult,
} from "../../../types/GradeComponent";

const BASE_ENDPOINT = "/grade-components";

export const fetchGradeComponentsApi = async (
  subjectId?: string
): Promise<GradeComponentDto[]> => {
  const response = await api.get<GradeComponentDto[]>(BASE_ENDPOINT, {
    params: subjectId ? { subjectId } : undefined,
  });
  return response.data;
};

export const getGradeComponentByIdApi = async (
  id: string
): Promise<GradeComponentDto> => {
  const response = await api.get<GradeComponentDto>(`${BASE_ENDPOINT}/${id}`);
  return response.data;
};

export const createGradeComponentApi = async (
  payload: CreateGradeComponentRequest
): Promise<GradeComponentCommandResult> => {
  const response = await api.post<GradeComponentCommandResult>(
    BASE_ENDPOINT,
    payload
  );
  return response.data;
};

export const updateGradeComponentApi = async (
  id: string,
  payload: UpdateGradeComponentRequest
): Promise<GradeComponentCommandResult> => {
  const response = await api.put<GradeComponentCommandResult>(
    `${BASE_ENDPOINT}/${id}`,
    payload
  );
  return response.data;
};

export const deleteGradeComponentApi = async (
  id: string
): Promise<GradeComponentCommandResult> => {
  const response = await api.delete<GradeComponentCommandResult>(
    `${BASE_ENDPOINT}/${id}`
  );
  return response.data;
};
