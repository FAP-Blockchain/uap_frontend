import api from "../../config/axios";
import type {
  WeeklyScheduleDto,
  WeeklyScheduleResponse,
} from "../../types/Schedule";

class TeacherServices {
  /**
   * Get weekly schedule for current teacher
   * Endpoint: GET /api/teachers/me/schedule
   */
  static async getMyWeeklySchedule(
    weekStartDate?: string
  ): Promise<WeeklyScheduleDto> {
    const response = await api.get<WeeklyScheduleResponse>(
      "/teachers/me/schedule",
      { params: weekStartDate ? { weekStartDate } : undefined }
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Không thể tải lịch giảng dạy tuần."
      );
    }

    return response.data.data;
  }
}

export default TeacherServices;

