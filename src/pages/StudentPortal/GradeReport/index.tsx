import React, { useState } from "react";
import { Card, Table, Typography, Tag, Row, Col, Collapse } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./GradeReport.scss";

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

interface GradeRecord {
  gradeCategory: string;
  gradeItem: string;
  weight: string;
  value: number | string;
  comment?: string;
  isTotal?: boolean;
  isCourseTotal?: boolean;
}

const GradeReport: React.FC = () => {
  const [, setSelectedCourse] = useState("MLN111");

  // Mock semester data (same as Attendance Report)
  const semesters: Semester[] = [
    {
      id: "sem9",
      name: "Fall 2025",
      courses: [
        { code: "MLN131", name: "Scientific Socialism", isActive: false },
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
          isActive: true,
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

  // Mock grade data based on the image
  const gradeData: GradeRecord[] = [
    {
      gradeCategory: "Participation",
      gradeItem: "Participation",
      weight: "10.0 %",
      value: 10,
    },
    {
      gradeCategory: "",
      gradeItem: "Total",
      weight: "10.0 %",
      value: 10,
      isTotal: true,
    },
    {
      gradeCategory: "Assignment",
      gradeItem: "Assignment",
      weight: "30.0 %",
      value: 10,
    },
    {
      gradeCategory: "",
      gradeItem: "Total",
      weight: "30.0 %",
      value: 10,
      isTotal: true,
    },
    {
      gradeCategory: "Progress tests",
      gradeItem: "Progress tests 1",
      weight: "15.0 %",
      value: 10,
    },
    {
      gradeCategory: "",
      gradeItem: "Progress tests 2",
      weight: "15.0 %",
      value: 10,
    },
    {
      gradeCategory: "",
      gradeItem: "Total",
      weight: "30.0 %",
      value: 10,
      isTotal: true,
    },
    {
      gradeCategory: "Final exam",
      gradeItem: "Final exam",
      weight: "30.0 %",
      value: 0,
      comment: "Absent",
    },
    {
      gradeCategory: "",
      gradeItem: "Total",
      weight: "30.0 %",
      value: 0,
      isTotal: true,
    },
    {
      gradeCategory: "Final exam Resit",
      gradeItem: "Final exam Resit",
      weight: "30.0 %",
      value: 8.8,
    },
    {
      gradeCategory: "",
      gradeItem: "Total",
      weight: "30.0 %",
      value: 8.8,
      isTotal: true,
    },
    {
      gradeCategory: "COURSE TOTAL",
      gradeItem: "AVERAGE",
      weight: "",
      value: 9.6,
      isCourseTotal: true,
    },
    {
      gradeCategory: "",
      gradeItem: "STATUS",
      weight: "",
      value: "PASSED",
      isCourseTotal: true,
    },
  ];

  const columns: ColumnsType<GradeRecord> = [
    {
      title: "GRADE CATEGORY",
      dataIndex: "gradeCategory",
      key: "gradeCategory",
      width: 200,
      render: (category: string, record: GradeRecord) => {
        if (record.isCourseTotal && category === "COURSE TOTAL") {
          return (
            <Text strong style={{ color: "#016fbb", fontSize: 14 }}>
              {category}
            </Text>
          );
        }
        return category ? <Text strong>{category}</Text> : null;
      },
    },
    {
      title: "GRADE ITEM",
      dataIndex: "gradeItem",
      key: "gradeItem",
      width: 200,
      render: (item: string, record: GradeRecord) => {
        if (record.isCourseTotal) {
          return (
            <Text
              strong
              style={{
                color: record.gradeItem === "STATUS" ? "#52c41a" : "#016fbb",
                fontSize: 14,
              }}
            >
              {item}
            </Text>
          );
        }
        if (record.isTotal) {
          return (
            <Text strong style={{ color: "#016fbb" }}>
              {item}
            </Text>
          );
        }
        return <Text>{item}</Text>;
      },
    },
    {
      title: "WEIGHT",
      dataIndex: "weight",
      key: "weight",
      width: 120,
      align: "center",
      render: (weight: string) => (weight ? <Text>{weight}</Text> : null),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      key: "value",
      width: 120,
      align: "center",
      render: (value: number | string, record: GradeRecord) => {
        if (record.isCourseTotal) {
          if (record.gradeItem === "STATUS") {
            return (
              <Tag color="success" style={{ fontSize: 12, fontWeight: 600 }}>
                {value}
              </Tag>
            );
          }
          return (
            <Text strong style={{ color: "#016fbb", fontSize: 14 }}>
              {value}
            </Text>
          );
        }
        if (record.isTotal) {
          return (
            <Text strong style={{ color: "#016fbb" }}>
              {value}
            </Text>
          );
        }
        if (value === 0) {
          return <Text style={{ color: "#ff4d4f" }}>{value}</Text>;
        }
        return <Text>{value}</Text>;
      },
    },
    {
      title: "COMMENT",
      dataIndex: "comment",
      key: "comment",
      align: "center",
      render: (comment?: string) => {
        if (comment === "Absent") {
          return <Tag color="error">{comment}</Tag>;
        }
        return comment ? <Text type="secondary">{comment}</Text> : null;
      },
    },
  ];

  const handleCourseClick = (course: string) => {
    setSelectedCourse(course);
  };

  return (
    <div className="grade-report">
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: "white" }}>
          Grade Report for Nghiêm Văn Hoàng (SE170117)
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Sidebar - Semester and Course Selection */}
        <Col xs={24} lg={6}>
          <Card className="sidebar-card">
            <div className="semester-list">
              <Collapse defaultActiveKey={["sem8"]} ghost>
                {semesters.map((semester) => (
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
                ))}
              </Collapse>
            </div>
          </Card>
        </Col>

        {/* Main Content - Grade Table */}
        <Col xs={24} lg={18}>
          <div className="report-section">
            {/* Grade Table */}
            <Card className="grade-table-card">
              <Table
                columns={columns}
                dataSource={gradeData}
                rowKey={(record, index) =>
                  `${record.gradeCategory}-${record.gradeItem}-${index}`
                }
                pagination={false}
                scroll={{ x: 800 }}
                size="small"
                className="grade-table"
                bordered
                rowClassName={(record) => {
                  if (
                    record.isCourseTotal &&
                    record.gradeCategory === "COURSE TOTAL"
                  )
                    return "course-total-row";
                  if (record.isCourseTotal && record.gradeItem === "STATUS")
                    return "status-row";
                  if (record.isTotal) return "total-row";
                  return "";
                }}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GradeReport;
