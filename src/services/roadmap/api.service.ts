import api from "../../config/axios";
import type {
  CurriculumRoadmapDto,
  CurriculumRoadmapSummaryDto,
  CurriculumSemesterDto,
  StudentRoadmapDto,
} from "../../types/Roadmap";

class RoadmapServices {
  /**
   * Get current student's curriculum roadmap from blockchain API
   * Endpoint: GET {VITE_API_BASE_URL}/students/me/curriculum-roadmap
   */
  static async getMyCurriculumRoadmap(): Promise<CurriculumRoadmapDto> {
    const response = await api.get<CurriculumRoadmapDto>(
      "/students/me/curriculum-roadmap"
    );
    return response.data;
  }

  /**
   * Get optimized curriculum roadmap summary (V2)
   * Endpoint: GET /api/students/me/curriculum-roadmap/summary
   */
  static async getMyCurriculumRoadmapSummary(): Promise<CurriculumRoadmapSummaryDto> {
    const response = await api.get<CurriculumRoadmapSummaryDto>(
      "/students/me/curriculum-roadmap/summary"
    );
    return response.data;
  }

  /**
   * Get roadmap details for a specific semester (lazy loaded)
   * Endpoint: GET /api/students/me/curriculum-roadmap/semesters?semesterNumber={n}
   */
  static async getMyCurriculumSemester(
    semesterNumber: number
  ): Promise<CurriculumSemesterDto> {
    const response = await api.get<CurriculumSemesterDto>(
      "/students/me/curriculum-roadmap/semesters",
      { params: { semesterNumber } }
    );
    return response.data;
  }

  /**
   * Get current student's roadmap overview (legacy)
   * Endpoint: GET /api/students/me/roadmap
   */
  static async getMyRoadmap(): Promise<StudentRoadmapDto> {
    const response = await api.get<StudentRoadmapDto>("/students/me/roadmap");
    return response.data;
  }
}

export default RoadmapServices;

