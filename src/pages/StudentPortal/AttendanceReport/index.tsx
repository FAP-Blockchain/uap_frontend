import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Collapse, Row, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";
import "./AttendanceReport.scss";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface Course {
  code: string;
  name: string;
  isActive: boolean;
}

interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

interface AttendanceRecord {
  no: number;
  date: string;
  slot: number;
  slotTime: string;
  room: string;
  lecturer: string;
  groupName: string;
  status: "Present" | "Absent" | "Future";
  lecturerComment?: string;
}

const AttendanceReport: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState("MLN131");
  const [activeSemesterKey, setActiveSemesterKey] = useState<string | string[]>(
    ["sem9"]
  );

  // Mock semester data
  const semesters: Semester[] = [
    {
      id: "sem9",
      name: "Fall 2025",
      courses: [
        { code: "MLN131", name: "Scientific Socialism", isActive: true },
        {
          code: "VNR202",
          name: "History of Vietnam Communist Party",
          isActive: false,
        },
        { code: "HCM202", name: "Ho Chi Minh Ideology", isActive: false },
        { code: "SEP490", name: "SE Capstone Project", isActive: false },
      ],
    },
    {
      id: "sem8",
      name: "Summer 2025",
      courses: [
        { code: "WDP301", name: "Web Development Project", isActive: false },
        {
          code: "EXE201",
          name: "Experiential Entrepreneurship 2",
          isActive: false,
        },
        { code: "PRM392", name: "Mobile Programming", isActive: false },
        {
          code: "MLN122",
          name: "Political Economics of Marxism – Leninism",
          isActive: false,
        },
        { code: "WDU203c", name: "The UI/UX Design", isActive: false },
        {
          code: "MLN111",
          name: "Philosophy of Marxism – Leninism",
          isActive: false,
        },
      ],
    },
    {
      id: "sem7",
      name: "Spring 2025",
      courses: [
        { code: "PMG201c", name: "Project Management", isActive: false },
        {
          code: "SWD392",
          name: "Software Architecture and Design",
          isActive: false,
        },
        {
          code: "EXE101",
          name: "Experiential Entrepreneurship 1",
          isActive: false,
        },
        {
          code: "SDN302",
          name: "Server-Side Development with NodeJS, Express, and MongoDB",
          isActive: false,
        },
        {
          code: "MMA301",
          name: "Multiplatform Mobile App Development",
          isActive: false,
        },
      ],
    },
    {
      id: "sem6",
      name: "Fall 2024",
      courses: [
        { code: "ENW492c", name: "Writing Research Papers", isActive: false },
        { code: "OJT202", name: "On the Job Training", isActive: false },
      ],
    },
    {
      id: "sem5",
      name: "Summer 2024",
      courses: [
        {
          code: "SWP391",
          name: "Software Development Project",
          isActive: false,
        },
        { code: "ITE302c", name: "Ethics in IT", isActive: false },
        { code: "SWR302", name: "Software Requirements", isActive: false },
        { code: "SWT301", name: "Software Testing", isActive: false },
        {
          code: "FER202",
          name: "Front-End Web Development with React",
          isActive: false,
        },
      ],
    },
    {
      id: "sem4",
      name: "Spring 2024",
      courses: [
        { code: "MAS291", name: "Statistics & Probability", isActive: false },
        {
          code: "SWE201c",
          name: "Introduction to Software Engineering",
          isActive: false,
        },
        {
          code: "JPD123",
          name: "Elementary Japanese 1 - A1.2",
          isActive: false,
        },
        { code: "IOT102", name: "Internet of Things", isActive: false },
        {
          code: "PRJ301",
          name: "Java Web Application Development",
          isActive: false,
        },
      ],
    },
    {
      id: "sem3",
      name: "Fall 2023",
      courses: [
        {
          code: "JPD113",
          name: "Elementary Japanese 1 - A1.1",
          isActive: false,
        },
        { code: "WED201c", name: "Web Design", isActive: false },
        {
          code: "CSD201",
          name: "Data Structures and Algorithms",
          isActive: false,
        },
        { code: "DBI202", name: "Database Systems", isActive: false },
        { code: "LAB211", name: "OOP with Java Lab", isActive: false },
      ],
    },
    {
      id: "sem2",
      name: "Summer 2023",
      courses: [
        {
          code: "PRO192",
          name: "Object-Oriented Programming",
          isActive: false,
        },
        { code: "MAD101", name: "Discrete Mathematics", isActive: false },
        { code: "OSG202", name: "Operating Systems", isActive: false },
        { code: "NWC203c", name: "Computer Networking", isActive: false },
        {
          code: "SSG104",
          name: "Communication and In-Group Working Skills",
          isActive: false,
        },
      ],
    },
    {
      id: "sem1",
      name: "Spring 2023",
      courses: [
        { code: "CSI104", name: "Introduction to Computing", isActive: false },
        {
          code: "SSL101c",
          name: "Academic Skills for University Success",
          isActive: false,
        },
        { code: "PRF192", name: "Programming Fundamentals", isActive: false },
        {
          code: "MAE101",
          name: "Mathematics for Engineering",
          isActive: false,
        },
        {
          code: "CEA201",
          name: "Computer Organization and Architecture",
          isActive: false,
        },
      ],
    },
  ];

  // Mock attendance data
  const attendanceData: AttendanceRecord[] = [
    {
      no: 1,
      date: "2025-09-08",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Present",
    },
    {
      no: 2,
      date: "2025-09-12",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Present",
    },
    {
      no: 3,
      date: "2025-09-16",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Absent",
    },
    {
      no: 4,
      date: "2025-09-19",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Present",
    },
    {
      no: 5,
      date: "2025-09-23",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Future",
    },
    {
      no: 6,
      date: "2025-09-26",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Future",
    },
    {
      no: 7,
      date: "2025-09-30",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Future",
    },
    {
      no: 8,
      date: "2025-10-03",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Future",
    },
    {
      no: 9,
      date: "2025-10-07",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Future",
    },
    {
      no: 10,
      date: "2025-10-10",
      slot: 2,
      slotTime: "09:30-11:45",
      room: "NVH 409",
      lecturer: "DuyNK32",
      groupName: "Half1_GD1705",
      status: "Future",
    },
  ];

  const getStatusTag = (status: string) => {
    switch (status) {
      case "Present":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Có mặt
          </Tag>
        );
      case "Absent":
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Vắng mặt
          </Tag>
        );
      case "Future":
        return (
          <Tag color="default" icon={<ExclamationCircleOutlined />}>
            Sắp tới
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getDateTag = (date: string) => {
    const dayOfWeek = dayjs(date).format("dddd");
    const dateFormatted = dayjs(date).format("DD/MM/YYYY");

    let color = "blue";
    if (dayOfWeek === "Tuesday") color = "blue";
    else if (dayOfWeek === "Friday") color = "green";

    return (
      <Tag color={color} style={{ minWidth: "90px", textAlign: "center" }}>
        {dayOfWeek} {dateFormatted}
      </Tag>
    );
  };

  const getSlotTag = (slot: number, slotTime: string) => {
    return (
      <Tag color="orange" style={{ minWidth: "80px", textAlign: "center" }}>
        {slot} {slotTime}
      </Tag>
    );
  };

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: "STT",
      dataIndex: "no",
      key: "no",
      width: 60,
      align: "center",
      render: (no: number) => <Text strong>{no}</Text>,
    },
    {
      title: "NGÀY",
      dataIndex: "date",
      key: "date",
      width: 150,
      align: "center",
      render: (date: string) => getDateTag(date),
    },
    {
      title: "CA HỌC",
      dataIndex: "slot",
      key: "slot",
      width: 120,
      align: "center",
      render: (slot: number, record: AttendanceRecord) =>
        getSlotTag(slot, record.slotTime),
    },
    {
      title: "PHÒNG",
      dataIndex: "room",
      key: "room",
      width: 100,
      align: "center",
      render: (room: string) => <Text strong>{room}</Text>,
    },
    {
      title: "GIẢNG VIÊN",
      dataIndex: "lecturer",
      key: "lecturer",
      width: 120,
      align: "center",
      render: (lecturer: string) => <Text>{lecturer}</Text>,
    },
    {
      title: "NHÓM",
      dataIndex: "groupName",
      key: "groupName",
      width: 140,
      align: "center",
      render: (groupName: string) => <Text>{groupName}</Text>,
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      width: 160,
      align: "center",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "NHẬN XÉT CỦA GIẢNG VIÊN",
      dataIndex: "lecturerComment",
      key: "lecturerComment",
      align: "center",
      render: (comment?: string) => (
        <Text type="secondary">{comment || ""}</Text>
      ),
    },
  ];

  // Calculate statistics
  const totalSessions = attendanceData.length;
  const completedSessions = attendanceData.filter(
    (record) => record.status !== "Future"
  ).length;
  const presentSessions = attendanceData.filter(
    (record) => record.status === "Present"
  ).length;
  const absentSessions = attendanceData.filter(
    (record) => record.status === "Absent"
  ).length;
  const absentPercentage =
    completedSessions > 0
      ? Math.round((absentSessions / completedSessions) * 100)
      : 0;

  const handleCourseClick = (course: string) => {
    setSelectedCourse(course);
  };

  return (
    <div className="attendance-report">
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: "#FFFFFF" }}>
          Xem điểm danh cho Nghiêm Văn Hoàng (SE170117)
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Sidebar - Semester and Course Selection */}
        <Col xs={24} lg={6}>
          <Card className="sidebar-card">
            <div className="semester-list">
              <Collapse
                activeKey={activeSemesterKey}
                onChange={(keys) => setActiveSemesterKey(keys)}
                ghost
              >
                {semesters.map((semester) => {
                  const isActive = Array.isArray(activeSemesterKey)
                    ? activeSemesterKey.includes(semester.id)
                    : activeSemesterKey === semester.id;

                  return (
                    <Panel header={semester.name} key={semester.id}>
                      {semester.courses.map((course) => (
                        <div
                          key={course.code}
                          className={`course-item ${
                            course.isActive ? "active" : ""
                          }`}
                          onClick={() => handleCourseClick(course.code)}
                        >
                          <Text strong className="course-code">
                            {course.code}
                          </Text>
                          <Text className="course-name">{course.name}</Text>
                        </div>
                      ))}
                    </Panel>
                  );
                })}
              </Collapse>
            </div>
          </Card>
        </Col>

        {/* Main Content - Attendance Table */}
        <Col xs={24} lg={18}>
          <div className="report-section">
            {/* Attendance Table */}
            <Card className="attendance-table-card">
              <Table
                columns={columns}
                dataSource={attendanceData}
                rowKey="no"
                pagination={false}
                scroll={{ x: 1000 }}
                size="small"
                className="attendance-table"
                bordered
              />

              {/* Summary */}
              <div className="attendance-summary">
                <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                  VẮNG MẶT: {absentPercentage}% VẮNG MẶT TỔNG CỘNG ({absentSessions}{" "}
                  VẮNG MẶT TRONG TỔNG SỐ {completedSessions} BUỔI HỌC).
                </Text>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AttendanceReport;
