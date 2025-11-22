export interface CurriculumListItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  totalCredits: number;
  subjectCount: number;
  studentCount: number;
}

export interface CurriculumSubjectDto {
  id: number;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  semesterNumber: number;
  prerequisiteSubjectId?: string | null;
  prerequisiteSubjectCode?: string | null;
  prerequisiteSubjectName?: string | null;
}

export interface CurriculumDetailDto extends CurriculumListItem {
  subjects: CurriculumSubjectDto[];
}

export interface CreateCurriculumRequest {
  code: string;
  name: string;
  description?: string;
  totalCredits: number;
}

export interface UpdateCurriculumRequest extends CreateCurriculumRequest {}

export interface AddSubjectToCurriculumRequest {
  subjectId: string;
  semesterNumber: number;
  prerequisiteSubjectId?: string;
}

export interface ApiResponseEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}
