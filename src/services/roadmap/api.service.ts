import api from "../../config/axios";
import type { CurriculumRoadmapDto, StudentRoadmapDto } from "../../types/Roadmap";

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
   * Get current student's roadmap overview (legacy)
   * Endpoint: GET /api/students/me/roadmap
   */
  static async getMyRoadmap(): Promise<StudentRoadmapDto> {
    const response = await api.get<StudentRoadmapDto>("/students/me/roadmap");
    return response.data;
  }
}

export default RoadmapServices;

