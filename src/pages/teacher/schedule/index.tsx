import React, { useState } from "react";
import {
  Card,
  Table,
  Typography,
  Tag,
  Button,
  Space,
  Select,
  DatePicker,
  Row,
  Col,
  Modal,
  Avatar,
  Tooltip,
  Badge,
  Form,
  Input,
} from "antd";
import type { BadgeProps } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "./index.scss";

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
  className: string;
  classId?: string;
  room: string;
  building: string;
  students: number;
  week: string;
  status?: "attended" | "absent" | "not_yet";
}

const TeacherSchedule: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(dayjs());

  const timetableData: TimetableSlot[] = [
    {
      slot: 1,
      time: "07:30 - 09:20",
      monday: {
        courseCode: "CTDL",
        courseName: "Cấu trúc dữ liệu",
        className: "CNTT2023B",
        classId: "2",
        room: "B205",
        building: "B",
        students: 32,
        status: "not_yet",
        week: "22/09 - 28/09",
      },
      wednesday: {
        courseCode: "JAVA",
        courseName: "Lập trình Java",
        className: "CNTT2022A",
        classId: "3",
        room: "C301",
        building: "C",
        students: 28,
        status: "not_yet",
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
      thursday: {
        courseCode: "DB",
        courseName: "Cơ sở dữ liệu",
        className: "CNTT2023A",
        classId: "1",
        room: "D102",
        building: "D",
        students: 35,
        status: "not_yet",
        week: "22/09 - 28/09",
      },
      friday: {
        courseCode: "HCM202",
        courseName: "Tư tưởng HCM",
        className: "XHH2021",
        classId: "4",
        room: "NVH 409",
        building: "NVH",
        students: 40,
        status: "attended",
        week: "22/09 - 28/09",
      },
    },
  ];

  interface StudentRow {
    index: number;
    image?: string;
    member: string;
    code: string;
    surname: string;
    middleName: string;
    givenName: string;
  }

  type SimpleAttendanceStatus = "present" | "absent" | "excused";

  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(
    null
  );
  const [selectedClassInfo, setSelectedClassInfo] = useState<{
    classId: string;
    className: string;
    courseName: string;
    room: string;
    date: string;
  } | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const sampleStudents: StudentRow[] = [
    {
      index: 1,
      image: "",
      member: "SE170101",
      code: "Nguyễn",
      surname: "Văn",
      middleName: "A",
      givenName: "",
    },
    {
      index: 2,
      image: "/api/placeholder/150/200",
      member: "SE170102",
      code: "Trần",
      surname: "Thị",
      middleName: "B",
      givenName: "",
    },
    {
      index: 3,
      image: "/api/placeholder/150/200",
      member: "SE170103",
      code: "Lê",
      surname: "Văn",
      middleName: "C",
      givenName: "",
    },
    {
      index: 4,
      image: "",
      member: "SE170104",
      code: "Phạm",
      surname: "Thị",
      middleName: "D",
      givenName: "",
    },
    {
      index: 5,
      image: "/api/placeholder/150/200",
      member: "SE170105",
      code: "Hoàng",
      surname: "Văn",
      middleName: "E",
      givenName: "",
    },
    {
      index: 6,
      image: "",
      member: "SE170106",
      code: "Đỗ",
      surname: "Thị",
      middleName: "F",
      givenName: "",
    },
    {
      index: 7,
      image: "/api/placeholder/150/200",
      member: "SE170107",
      code: "Bùi",
      surname: "Văn",
      middleName: "G",
      givenName: "",
    },
    {
      index: 8,
      image: "",
      member: "SE170108",
      code: "Phan",
      surname: "Thị",
      middleName: "H",
      givenName: "",
    },
    {
      index: 9,
      image: "/api/placeholder/150/200",
      member: "SE170109",
      code: "Vũ",
      surname: "Văn",
      middleName: "I",
      givenName: "",
    },
    {
      index: 10,
      image: "",
      member: "SE170110",
      code: "Đặng",
      surname: "Thị",
      middleName: "K",
      givenName: "",
    },
    {
      index: 11,
      image: "/api/placeholder/150/200",
      member: "SE170111",
      code: "Ngô",
      surname: "Bảo",
      middleName: "Long",
      givenName: "",
    },
    {
      index: 12,
      image: "",
      member: "SE170112",
      code: "Vũ",
      surname: "Minh",
      middleName: "Đức",
      givenName: "",
    },
    {
      index: 13,
      image: "/api/placeholder/150/200",
      member: "SE170113",
      code: "Đặng",
      surname: "Thị",
      middleName: "Hoa",
      givenName: "",
    },
    {
      index: 14,
      image: "",
      member: "SE170114",
      code: "Bùi",
      surname: "Văn",
      middleName: "Nam",
      givenName: "",
    },
    {
      index: 15,
      image: "/api/placeholder/150/200",
      member: "SE170115",
      code: "Hoàng",
      surname: "Thị",
      middleName: "Lan",
      givenName: "",
    },
    {
      index: 16,
      image: "",
      member: "SE170116",
      code: "Đinh",
      surname: "Quang",
      middleName: "Huy",
      givenName: "",
    },
    {
      index: 17,
      image: "/api/placeholder/150/200",
      member: "SE170117",
      code: "Võ",
      surname: "Thành",
      middleName: "Đạt",
      givenName: "",
    },
    {
      index: 18,
      image: "",
      member: "SE170118",
      code: "Lý",
      surname: "Minh",
      middleName: "Tuấn",
      givenName: "",
    },
    {
      index: 19,
      image: "/api/placeholder/150/200",
      member: "SE170119",
      code: "Trịnh",
      surname: "Thị",
      middleName: "Mai",
      givenName: "",
    },
    {
      index: 20,
      image: "",
      member: "SE170120",
      code: "Đỗ",
      surname: "Văn",
      middleName: "Phú",
      givenName: "",
    },
  ];

  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, { status: SimpleAttendanceStatus; note?: string }>
  >({});

  const getAttStatusText = (s: SimpleAttendanceStatus) =>
    s === "present" ? "Có mặt" : s === "absent" ? "Vắng" : "Có phép";
  const getAttBadgeStatus = (s: SimpleAttendanceStatus) =>
    s === "present" ? "success" : s === "absent" ? "error" : "default";

  const getStatusTag = (status?: string) => {
    switch (status) {
      case "attended":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã dạy
          </Tag>
        );
      case "absent":
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Vắng
          </Tag>
        );
      case "not_yet":
        return (
          <Tag color="warning" icon={<ExclamationCircleOutlined />}>
            Chưa dạy
          </Tag>
        );
      default:
        return null;
    }
  };

  const renderClassCell = (classInfo?: ClassInfo, dayKey?: string) => {
    if (!classInfo) return <div className="empty-slot">-</div>;

    const dayOffset: Record<string, number> = {
      mon: 0,
      tue: 1,
      wed: 2,
      thu: 3,
      fri: 4,
      sat: 5,
      sun: 6,
    };
    const dateStr =
      dayKey != null
        ? selectedWeek
            .startOf("week")
            .add(dayOffset[dayKey] || 0, "day")
            .format("YYYY-MM-DD")
        : selectedWeek.format("YYYY-MM-DD");

    return (
      <div
        className="class-slot"
        onClick={() => {
          // Mở modal điểm danh inline giống Student
          setSelectedClassInfo({
            classId: classInfo.classId || "1",
            className: classInfo.className,
            courseName: classInfo.courseName,
            room: classInfo.room,
            date: dateStr,
          });
          const initial: Record<
            string,
            { status: SimpleAttendanceStatus; note?: string }
          > = {};
          sampleStudents.forEach((s) => {
            initial[s.member] = { status: "present" };
          });
          setAttendanceRecords(initial);
          // Điều hướng sang trang danh sách lớp của Teacher
          window.location.href = `/teacher/class-list/${classInfo.courseCode}`;
        }}
        style={{ cursor: "pointer" }}
      >
        <div className="course-code">
          <Text strong>{classInfo.courseCode}</Text>
          <Button type="link" size="small">
            Tài liệu
          </Button>
        </div>
        <div className="course-info">
          <Text style={{ fontSize: 12 }}>
            {classInfo.className} • {classInfo.room} - {classInfo.building} •{" "}
            {classInfo.students} SV
          </Text>
        </div>
        <div className="attendance-status">
          {getStatusTag(classInfo.status)}
        </div>
        <div className="time-info">
          <Text type="secondary">Tuần {classInfo.week}</Text>
        </div>
      </div>
    );
  };

  const columns: ColumnsType<TimetableSlot> = [
    {
      title: "Tiết",
      dataIndex: "slot",
      key: "slot",
      width: 120,
      render: (slot: number, record: TimetableSlot) => (
        <div className="time-slot-header">
          <div className="slot-number">Tiết {slot}</div>
          <div className="slot-time">{record.time}</div>
        </div>
      ),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>TH 2</span>
          <div className="date-number">22/09</div>
        </div>
      ),
      dataIndex: "monday",
      key: "monday",
      render: (info: ClassInfo) => renderClassCell(info, "mon"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>TH 3</span>
          <div className="date-number">23/09</div>
        </div>
      ),
      dataIndex: "tuesday",
      key: "tuesday",
      render: (info: ClassInfo) => renderClassCell(info, "tue"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>TH 4</span>
          <div className="date-number">24/09</div>
        </div>
      ),
      dataIndex: "wednesday",
      key: "wednesday",
      render: (info: ClassInfo) => renderClassCell(info, "wed"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>TH 5</span>
          <div className="date-number">25/09</div>
        </div>
      ),
      dataIndex: "thursday",
      key: "thursday",
      render: (info: ClassInfo) => renderClassCell(info, "thu"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>TH 6</span>
          <div className="date-number">26/09</div>
        </div>
      ),
      dataIndex: "friday",
      key: "friday",
      render: (info: ClassInfo) => renderClassCell(info, "fri"),
    },
    {
      title: (
        <div className="day-header">
          <CalendarOutlined />
          <span>TH 7</span>
          <div className="date-number">27/09</div>
        </div>
      ),
      dataIndex: "saturday",
      key: "saturday",
      render: (info: ClassInfo) => renderClassCell(info, "sat"),
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
      render: (info: ClassInfo) => renderClassCell(info, "sun"),
    },
  ];

  return (
    <div className="teacher-schedule">
      <div className="timetable-header">
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              Lịch giảng dạy theo tuần
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Xem thời khóa biểu trong tuần của giảng viên
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setSelectedWeek(dayjs())}
              >
                Tuần hiện tại
              </Button>
            </Space>
          </Col>
        </Row>

        <Card className="week-nav-card">
          <Row align="middle" justify="space-between">
            <Col>
              <Space>
                <Button type="primary">← Tuần trước</Button>
                <Button>Tuần sau →</Button>
              </Space>
            </Col>
            <Col>
              <div className="week-info">
                <Title level={4} style={{ margin: 0 }}>
                  Tuần: {selectedWeek.format("DD/MM")} -{" "}
                  {selectedWeek.add(6, "day").format("DD/MM/YYYY")}
                </Title>
                <Text type="secondary">
                  Học kỳ Fall 2024 • Tuần {selectedWeek.week()}
                </Text>
              </div>
            </Col>
            <Col>
              <Space>
                <Select defaultValue="2025" style={{ width: 100 }}>
                  <Option value="2024">2024</Option>
                  <Option value="2025">2025</Option>
                </Select>
                <DatePicker.WeekPicker
                  value={selectedWeek}
                  onChange={(d) => d && setSelectedWeek(d)}
                  style={{ width: 200 }}
                />
              </Space>
            </Col>
          </Row>
        </Card>
      </div>

      <Card className="timetable-card">
        <Table
          columns={columns}
          dataSource={timetableData}
          rowKey="slot"
          pagination={false}
          bordered
          size="middle"
          className="timetable-table"
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={
          selectedClassInfo
            ? `Điểm danh: ${selectedClassInfo.className} • ${selectedClassInfo.courseName}`
            : "Điểm danh lớp"
        }
        open={attendanceModalVisible}
        onCancel={() => setAttendanceModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedClassInfo && (
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">Phòng {selectedClassInfo.room}</Tag>
            <Tag color="purple">
              Ngày {dayjs(selectedClassInfo.date).format("DD/MM/YYYY")}
            </Tag>
            <div style={{ float: "right" }}>
              <Input.Search
                placeholder="Tìm sinh viên..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 260 }}
                allowClear
              />
            </div>
          </div>
        )}

        {(() => {
          const attColumns: ColumnsType<StudentRow> = [
            {
              title: "INDEX",
              dataIndex: "index",
              key: "index",
              width: 80,
              align: "center",
            },
            {
              title: "IMAGE",
              dataIndex: "image",
              key: "image",
              width: 100,
              align: "center",
              render: (image: string) => (
                <Avatar
                  size={64}
                  src={image || undefined}
                  style={{
                    background: image ? "none" : "#f0f0f0",
                    border: "1px solid #d9d9d9",
                  }}
                />
              ),
            },
            {
              title: "MEMBER",
              dataIndex: "member",
              key: "member",
              width: 120,
              render: (member: string) => <Text strong>{member}</Text>,
            },
            {
              title: "CODE",
              dataIndex: "code",
              key: "code",
              width: 100,
            },
            {
              title: "SURNAME",
              dataIndex: "surname",
              key: "surname",
              width: 100,
            },
            {
              title: "MIDDLE NAME",
              dataIndex: "middleName",
              key: "middleName",
              width: 120,
            },
            {
              title: "GIVEN NAME",
              dataIndex: "givenName",
              key: "givenName",
              width: 120,
              render: (givenName: string) => givenName || "-",
            },
            {
              title: "TRẠNG THÁI",
              key: "status",
              render: (_value: unknown, student: StudentRow) => {
                const s =
                  attendanceRecords[student.member]?.status || "present";
                return (
                  <Badge
                    status={getAttBadgeStatus(s) as BadgeProps["status"]}
                    text={
                      <span style={{ fontWeight: 500 }}>
                        {getAttStatusText(s)}
                      </span>
                    }
                  />
                );
              },
            },
            {
              title: "ĐIỂM DANH",
              key: "actions",
              fixed: "right",
              render: (_value: unknown, student: StudentRow) => (
                <Space>
                  <Tooltip title="Có mặt">
                    <Button
                      type={
                        (attendanceRecords[student.member]?.status ||
                          "present") === "present"
                          ? "primary"
                          : "default"
                      }
                      icon={<CheckCircleOutlined />}
                      size="small"
                      onClick={() =>
                        setAttendanceRecords((prev) => ({
                          ...prev,
                          [student.member]: {
                            ...prev[student.member],
                            status: "present",
                          },
                        }))
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Vắng">
                    <Button
                      danger={
                        (attendanceRecords[student.member]?.status ||
                          "present") === "absent"
                      }
                      icon={<CloseCircleOutlined />}
                      size="small"
                      onClick={() =>
                        setAttendanceRecords((prev) => ({
                          ...prev,
                          [student.member]: {
                            ...prev[student.member],
                            status: "absent",
                          },
                        }))
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Có phép">
                    <Button
                      icon={<ExclamationCircleOutlined />}
                      size="small"
                      type={
                        (attendanceRecords[student.member]?.status ||
                          "present") === "excused"
                          ? "primary"
                          : "default"
                      }
                      onClick={() => {
                        setSelectedStudent(student);
                        setReasonModalVisible(true);
                      }}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ];

          return (
            <Table
              dataSource={sampleStudents.filter(
                (s) =>
                  s.member.toLowerCase().includes(searchText.toLowerCase()) ||
                  s.surname.toLowerCase().includes(searchText.toLowerCase()) ||
                  s.middleName
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  s.code.toLowerCase().includes(searchText.toLowerCase())
              )}
              rowKey="member"
              pagination={{ pageSize: 20 }}
              size="middle"
              columns={attColumns}
            />
          );
        })()}
      </Modal>

      <Modal
        title={
          selectedStudent
            ? `Lý do vắng có phép - ${selectedStudent.member}`
            : "Lý do vắng có phép"
        }
        open={reasonModalVisible}
        onOk={() => {
          form.validateFields().then((values) => {
            if (selectedStudent) {
              setAttendanceRecords((prev) => ({
                ...prev,
                [selectedStudent.member]: {
                  status: "excused",
                  note: values.excuseReason,
                },
              }));
            }
            setReasonModalVisible(false);
            setSelectedStudent(null);
            form.resetFields(["excuseReason"]);
          });
        }}
        onCancel={() => {
          setReasonModalVisible(false);
          setSelectedStudent(null);
          form.resetFields(["excuseReason"]);
        }}
        width={520}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="excuseReason"
            label="Lý do"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="VD: Bệnh, giấy phép, công tác..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherSchedule;
