import api from "../../config/axios";
import type {
  AttendanceDto,
  AttendanceFilterRequest,
  AttendanceStatisticsDto,
  TakeAttendanceRequest,
  SlotAttendanceDto,
  UpdateAttendanceRequest,
  ExcuseAbsenceRequest,
} from "../../types/Attendance";

interface AttendanceListResponse {
  success: boolean;
  message?: string;
  data: AttendanceDto[];
}

interface AttendanceStatsResponse {
  success: boolean;
  data: AttendanceStatisticsDto;
}

class AttendanceServices {
  /**
   * Get current student's attendance records
   * Endpoint: GET /api/students/me/attendance
   */
  static async getMyAttendance(
    params?: AttendanceFilterRequest
  ): Promise<AttendanceDto[]> {
    const response = await api.get<AttendanceListResponse>(
      "/students/me/attendance",
      {
        params,
      }
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Không thể tải dữ liệu điểm danh."
      );
    }

    return response.data.data;
  }

  /**
   * Get attendance statistics for current student
   * Endpoint: GET /api/students/me/attendance/statistics
   */
  static async getMyAttendanceStatistics(
    classId?: string
  ): Promise<AttendanceStatisticsDto> {
    const response = await api.get<AttendanceStatsResponse>(
      "/students/me/attendance/statistics",
      {
        params: classId ? { classId } : undefined,
      }
    );

    if (!response.data.success) {
      throw new Error("Không thể tải thống kê điểm danh.");
    }

    return response.data.data;
  }

  /**
   * Take attendance for a slot
   * Endpoint: POST /api/attendance
   */
  static async takeAttendance(
    request: TakeAttendanceRequest
  ): Promise<void> {
    await api.post("/attendance", request);
  }

  /**
   * Get attendance for a specific slot
   * Endpoint: GET /api/slots/{slotId}/attendance
   */
  static async getSlotAttendance(
    slotId: string
  ): Promise<SlotAttendanceDto> {
    const response = await api.get<{
      success: boolean;
      data: import("../../types/Attendance").SlotAttendanceDto;
    }>(`/slots/${slotId}/attendance`);

    if (!response.data.success) {
      throw new Error("Không thể tải dữ liệu điểm danh.");
    }

    return response.data.data;
  }

  /**
   * Take attendance for a specific slot
   * Endpoint: POST /api/slots/{slotId}/attendance
   */
  static async takeSlotAttendance(
    slotId: string,
    students: Array<{
      studentId: string;
      isPresent: boolean;
      notes?: string;
    }>
  ): Promise<void> {
    await api.post(`/slots/${slotId}/attendance`, { students }, {
      skipGlobalErrorHandler: true,
    } as any);
  }

  /**
   * Update attendance for a specific slot
   * Endpoint: PUT /api/slots/{slotId}/attendance
   */
  static async updateSlotAttendance(
    slotId: string,
    students: Array<{
      studentId: string;
      isPresent: boolean;
      notes?: string;
    }>
  ): Promise<void> {
    await api.put(`/slots/${slotId}/attendance`, { students }, {
      skipGlobalErrorHandler: true,
    } as any);
  }

  /**
   * Mark all students as present for a slot
   * Endpoint: POST /api/slots/{slotId}/attendance/mark-all-present
   */
  static async markAllPresent(slotId: string): Promise<void> {
    await api.post(`/slots/${slotId}/attendance/mark-all-present`);
  }

  /**
   * Mark all students as absent for a slot
   * Endpoint: POST /api/slots/{slotId}/attendance/mark-all-absent
   */
  static async markAllAbsent(slotId: string): Promise<void> {
    await api.post(`/slots/${slotId}/attendance/mark-all-absent`);
  }

  /**
   * Get attendance details by ID
   * Endpoint: GET /api/attendance/{id}
   */
  static async getAttendanceById(
    id: string
  ): Promise<import("../../types/Attendance").AttendanceDetailDto> {
    const response = await api.get<{
      success: boolean;
      data: import("../../types/Attendance").AttendanceDetailDto;
    }>(`/attendance/${id}`);

    if (!response.data.success) {
      throw new Error("Không thể tải chi tiết điểm danh.");
    }

    return response.data.data;
  }

  /**
   * Update an existing attendance record
   * Endpoint: PUT /api/attendance/{id}
   */
  static async updateAttendance(
    id: string,
    request: UpdateAttendanceRequest
  ): Promise<import("../../types/Attendance").AttendanceDetailDto> {
    const response = await api.put<{
      success: boolean;
      data: import("../../types/Attendance").AttendanceDetailDto;
    }>(`/attendance/${id}`, request);

    if (!response.data.success) {
      throw new Error("Không thể cập nhật điểm danh.");
    }

    return response.data.data;
  }

  /**
   * Student requests excuse for absence
   * Endpoint: POST /api/attendance/{id}/excuse
   */
  static async excuseAbsence(
    id: string,
    request: ExcuseAbsenceRequest
  ): Promise<import("../../types/Attendance").AttendanceDetailDto> {
    const response = await api.post<{
      success: boolean;
      data: import("../../types/Attendance").AttendanceDetailDto;
    }>(`/attendance/${id}/excuse`, request);

    if (!response.data.success) {
      throw new Error("Không thể gửi đơn xin phép vắng.");
    }

    return response.data.data;
  }

  /**
   * Get filtered attendance records with pagination
   * Endpoint: GET /api/attendance/filter
   */
  static async getAttendancesByFilter(
    filter: AttendanceFilterRequest
  ): Promise<AttendanceDto[]> {
    const response = await api.get<{
      success: boolean;
      data: AttendanceDto[];
    }>("/attendance/filter", { params: filter });

    if (!response.data.success) {
      throw new Error("Không thể tải danh sách điểm danh.");
    }

    return response.data.data;
  }

  /**
   * Save on-chain info after frontend issues tx
   * Endpoint: POST /api/attendance/{id}/on-chain
   */
  static async saveAttendanceOnChain(
    id: string,
    request: {
      transactionHash: string;
      onChainRecordId?: string;
    }
  ): Promise<boolean> {
    const response = await api.post<{
      success: boolean;
      message?: string;
      data?: boolean;
    }>(`/attendance/${id}/on-chain`, request);

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
          "Không thể lưu thông tin on-chain cho bản ghi điểm danh."
      );
    }

    return response.data.data ?? true;
  }
}

export default AttendanceServices;

