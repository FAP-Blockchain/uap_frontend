import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "./WeeklyTimetable.scss";

dayjs.extend(weekOfYear);

const { Title, Text } = Typography;
const { Option } = Select;

interface TimetableSlot {
  slot: number;
  time: string;
  monday?: ClassInfo;
  tuesday?: ClassInfo;
  wednesday?: ClassInfo;
  thursday?: ClassInfo;
  friday?: ClassInfo;
  saturday?: ClassInfo;
  sunday?: ClassInfo;
}

interface ClassInfo {
  courseCode: string;
  courseName: string;
  instructor: string;
  room: string;
  building: string;
  attendance?: "attended" | "absent" | "not_yet";
  week: string;
}

const WeeklyTimetable: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(dayjs());

  // Mock timetable data for current week
  const timetableData: TimetableSlot[] = [
    {
      slot: 1,
      time: "07:30 - 09:20",
      tuesday: {
        courseCode: "HCM202",
        courseName: "Ho Chi Minh Ideology",
        instructor: "Dr. Nguyen Van A",
        room: "NVH 409",
        building: "NVH",
        attendance: "attended",
        week: "22/09 - 28/09",
      },
      thursday: {
        courseCode: "HCM202",
        courseName: "Ho Chi Minh Ideology",
        instructor: "Dr. Nguyen Van A",
        room: "NVH 409",
        building: "NVH",
        attendance: "not_yet",
        week: "22/09 - 28/09",
      },
    },
    {
      slot: 2,
      time: "09:30 - 11:20",
    },
    {
      slot: 3,
      time: "12:30 - 14:20",
      tuesday: {
        courseCode: "MLN131",
        courseName: "Marxist-Leninist Philosophy",
        instructor: "Prof. Tran Thi B",
        room: "NVH 502",
        building: "NVH",
        attendance: "attended",
        week: "22/09 - 28/09",
      },
      thursday: {
        courseCode: "MLN131",
        courseName: "Marxist-Leninist Philosophy",
        instructor: "Prof. Tran Thi B",
        room: "NVH 502",
        building: "NVH",
        attendance: "not_yet",
        week: "22/09 - 28/09",
      },
      saturday: {
        courseCode: "SEP490",
        courseName: "Capstone Project",
        instructor: "Mr. Le Van C",
        room: "P.136",
        building: "Alpha",
        attendance: "not_yet",
        week: "22/09 - 28/09",
      },
    },
    {
      slot: 4,
      time: "14:30 - 16:20",
    },
  ];

  const getAttendanceTag = (attendance?: string) => {
    switch (attendance) {
      case "attended":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã tham gia
          </Tag>
        );
      case "absent":
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Vắng mặt
          </Tag>
        );
      case "not_yet":
        return (
          <Tag color="warning" icon={<ExclamationCircleOutlined />}>
            Chưa có
          </Tag>
        );
      default:
        return null;
    }
  };

  const getActivityId = (classInfo: ClassInfo, dayKey: string) => {
    // Generate a unique ID for the activity based on course code and day
    return `${classInfo.courseCode.toLowerCase()}_${dayKey}_slot${
      classInfo.courseCode === "HCM202"
        ? "2"
        : classInfo.courseCode === "MLN131"
        ? "3"
        : "3"
    }`;
  };

  const renderClassCell = (classInfo?: ClassInfo, dayKey?: string) => {
    if (!classInfo) {
      return <div className="empty-slot">-</div>;
    }

    const handleViewDetails = () => {
      const activityId = getActivityId(classInfo, dayKey || "tue");
      navigate(`/student-portal/activity/${activityId}`);
    };

    return (
      <div
        className="class-slot"
        onClick={handleViewDetails}
        style={{ cursor: "pointer" }}
      >
        <div className="course-code">
          <Text strong>{classInfo.courseCode}</Text>
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              Xem tài liệu
            </Button>
          </Tooltip>
        </div>
        <div className="course-info">
          <Text style={{ fontSize: 12 }}>
            tại {classInfo.room} - {classInfo.building}
          </Text>
        </div>
        <div className="attendance-status">
          {getAttendanceTag(classInfo.attendance)}
        </div>
        <div className="time-info">
          <Text type="secondary" style={{ fontSize: 11 }}>
            ({classInfo.week})
          </Text>
        </div>
      </div>
    );
  };

  const columns: ColumnsType<TimetableSlot> = [
    {
      title: "Ca học",
      dataIndex: "slot",
      key: "slot",
      width: 100,
      render: (slot: number, record: TimetableSlot) => (
        <div className="time-slot-header">
          <div className="slot-number">Ca {slot}</div>
          <div className="slot-time">{record.time}</div>
        </div>
      ),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>T2</span>
          <div className="date-number">22/09</div>
        </div>
      ),
      dataIndex: "monday",
      key: "monday",
      width: 110,
      render: (classInfo: ClassInfo) => renderClassCell(classInfo, "mon"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>T3</span>
          <div className="date-number">23/09</div>
        </div>
      ),
      dataIndex: "tuesday",
      key: "tuesday",
      width: 110,
      render: (classInfo: ClassInfo) => renderClassCell(classInfo, "tue"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>T4</span>
          <div className="date-number">24/09</div>
        </div>
      ),
      dataIndex: "wednesday",
      key: "wednesday",
      width: 110,
      render: (classInfo: ClassInfo) => renderClassCell(classInfo, "wed"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>T5</span>
          <div className="date-number">25/09</div>
        </div>
      ),
      dataIndex: "thursday",
      key: "thursday",
      width: 110,
      render: (classInfo: ClassInfo) => renderClassCell(classInfo, "thu"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>T6</span>
          <div className="date-number">26/09</div>
        </div>
      ),
      dataIndex: "friday",
      key: "friday",
      width: 110,
      render: (classInfo: ClassInfo) => renderClassCell(classInfo, "fri"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>T7</span>
          <div className="date-number">27/09</div>
        </div>
      ),
      dataIndex: "saturday",
      key: "saturday",
      width: 110,
      render: (classInfo: ClassInfo) => renderClassCell(classInfo, "sat"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>CN</span>
          <div className="date-number">28/09</div>
        </div>
      ),
      dataIndex: "sunday",
      key: "sunday",
      width: 110,
      render: (classInfo: ClassInfo) => renderClassCell(classInfo, "sun"),
    },
  ];

  const handleWeekChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedWeek(selectedWeek.subtract(1, "week"));
    } else {
      setSelectedWeek(selectedWeek.add(1, "week"));
    }
  };

  return (
    <div className="weekly-timetable">
      {/* Page Header */}
      <div className="timetable-header">
        {/* Week Navigation */}
        <Card className="week-nav-card">
          <Row align="middle" justify="space-between">
            <Col>
              <Space>
                <Button type="primary" onClick={() => handleWeekChange("prev")}>
                  ← Tuần trước
                </Button>
                <Button onClick={() => handleWeekChange("next")}>
                  Tuần sau →
                </Button>
              </Space>
            </Col>
            <Col>
              <div className="week-info">
                <Title level={4} style={{ margin: 0 }}>
                  Tuần: {selectedWeek.format("DD/MM")} -{" "}
                  {selectedWeek.add(6, "day").format("DD/MM/YYYY")}
                </Title>
                <Text type="secondary">
                  Học kỳ: Fall 2025 • Tuần {selectedWeek.week()}
                </Text>
              </div>
            </Col>
            <Col>
              <div className="date-controls">
                <Space size="middle">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => setSelectedWeek(dayjs())}
                    className="current-week-btn"
                  >
                    Tuần hiện tại
                  </Button>
                  <div className="date-select-group">
                    <Select
                      defaultValue="2025"
                      className="year-select"
                      suffixIcon={null}
                    >
                      <Option value="2024">2024</Option>
                      <Option value="2025">2025</Option>
                    </Select>
                    <DatePicker.WeekPicker
                      value={selectedWeek}
                      onChange={(date: dayjs.Dayjs | null) =>
                        date && setSelectedWeek(date)
                      }
                      className="week-picker"
                      format="YYYY-wo"
                      placeholder="Chọn tuần"
                      allowClear={false}
                    />
                  </div>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Timetable */}
      <Card className="timetable-card">
        <Table
          columns={columns}
          dataSource={timetableData}
          rowKey="slot"
          pagination={false}
          bordered
          size="middle"
          className="timetable-table"
        />
      </Card>

      {/* Legend */}
      <Card style={{ marginTop: 24 }}>
        <Row gutter={[16, 8]} align="middle">
          <Col>
            <Text strong>Chú thích:</Text>
          </Col>
          <Col>
            <Space>
              <Badge
                color="#52c41a"
                text="Đã tham gia - Sinh viên đã tham gia lớp học này"
              />
              <Badge color="#ff4d4f" text="Vắng mặt - Sinh viên đã vắng mặt" />
              <Badge color="#faad14" text="Chưa có - Lớp học chưa bắt đầu" />
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default WeeklyTimetable;
