import React, { useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Typography,
  Avatar,
  Space,
  Input,
  Form,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  Badge,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  SearchOutlined,
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import "./index.scss";

const { Title, Text } = Typography;
const { Search } = Input;

type SimpleAttendanceStatus = "present" | "absent" | "excused";

interface StudentRow {
  index: number;
  image?: string;
  member: string;
  code: string;
  surname: string;
  middleName: string;
  givenName: string;
}

const TeacherClassStudentList: React.FC = () => {
  const navigate = useNavigate();
  const { courseCode = "COURSE" } = useParams();
  const location = useLocation();
  const state = (location.state || {}) as {
    className?: string;
    room?: string;
    date?: string;
  };
  const [searchText, setSearchText] = useState("");

  const students: StudentRow[] = useMemo(
    () => [
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
    ],
    []
  );

  const [attendance, setAttendance] = useState<
    Record<string, SimpleAttendanceStatus>
  >({});
  const [attendanceNotes, setAttendanceNotes] = useState<
    Record<string, string>
  >({});
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(
    null
  );
  const [form] = Form.useForm();

  const getStatusText = (s: SimpleAttendanceStatus) =>
    s === "present" ? "Có mặt" : s === "absent" ? "Vắng" : "Vắng mặt có phép";
  const getBadgeStatus = (s: SimpleAttendanceStatus) =>
    s === "present" ? "success" : s === "absent" ? "error" : "default";

  const filtered = students.filter(
    (s) =>
      s.member.toLowerCase().includes(searchText.toLowerCase()) ||
      s.surname.toLowerCase().includes(searchText.toLowerCase()) ||
      s.middleName.toLowerCase().includes(searchText.toLowerCase()) ||
      s.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<StudentRow> = [
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
          icon={<UserOutlined />}
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
      render: (m: string) => <Text strong>{m}</Text>,
    },
    { title: "CODE", dataIndex: "code", key: "code", width: 100 },
    { title: "SURNAME", dataIndex: "surname", key: "surname", width: 100 },
    {
      title: "MIDDLE NAME",
      dataIndex: "middleName",
      key: "middleName",
      width: 120,
    },

    {
      title: "STATUS",
      key: "status",
      render: (_v, s) => {
        const st = attendance[s.member] || "present";
        return (
          <Badge
            status={getBadgeStatus(st) as any}
            text={<span style={{ fontWeight: 500 }}>{getStatusText(st)}</span>}
          />
        );
      },
    },
    {
      title: "ATTEND",
      key: "actions",
      fixed: "right",
      render: (_v, s) => (
        <Space>
          <Tooltip title="Có mặt">
            <Button
              type={
                (attendance[s.member] || "present") === "present"
                  ? "primary"
                  : "default"
              }
              icon={<CheckCircleOutlined />}
              size="small"
              onClick={() =>
                setAttendance((p) => ({ ...p, [s.member]: "present" }))
              }
            />
          </Tooltip>
          <Tooltip title="Vắng">
            <Button
              danger={(attendance[s.member] || "present") === "absent"}
              icon={<CloseCircleOutlined />}
              size="small"
              onClick={() =>
                setAttendance((p) => ({ ...p, [s.member]: "absent" }))
              }
            />
          </Tooltip>
          <Tooltip title="Vắng mặt có phép">
            <Button
              type={
                (attendance[s.member] || "present") === "excused"
                  ? "primary"
                  : "default"
              }
              icon={<ExclamationCircleOutlined />}
              size="small"
              onClick={() => {
                setSelectedStudent(s);
                form.setFieldsValue({
                  excuseReason: attendanceNotes[s.member],
                });
                setReasonModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="teacher-class-student-list">
      <div className="list-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          Back
        </Button>

        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              Student List
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {state.className || "Class"} • {courseCode}
            </Text>
          </Col>
          <Col>
            <Space>
              <Search
                placeholder="Search students..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
            </Space>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="Total Students"
              value={students.length}
              prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="Course"
              value={courseCode}
              prefix={<BookOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Tag color="blue" style={{ marginRight: 8 }}>
              Room {state.room || "A101"}
            </Tag>
            <Tag color="purple">
              {dayjs(state.date || new Date()).format("DD/MM/YYYY")}
            </Tag>
          </Card>
        </Col>
      </Row>

      <Card className="student-table-card">
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="member"
          pagination={{
            total: filtered.length,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t, r) => `${r[0]}-${r[1]} of ${t} students`,
          }}
          scroll={{ x: 900 }}
          size="middle"
          className="student-list-table"
          bordered
        />
      </Card>

      <Modal
        title={
          selectedStudent
            ? `Lý do vắng mặt có phép - ${selectedStudent.member}`
            : "Lý do vắng mặt có phép"
        }
        open={reasonModalVisible}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              if (selectedStudent) {
                setAttendance((p) => ({
                  ...p,
                  [selectedStudent.member]: "excused",
                }));
                setAttendanceNotes((p) => ({
                  ...p,
                  [selectedStudent.member]: values.excuseReason,
                }));
              }
              setReasonModalVisible(false);
              form.resetFields(["excuseReason"]);
            })
            .catch(() => {});
        }}
        onCancel={() => {
          setReasonModalVisible(false);
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
              placeholder="VD: Bệnh, có giấy phép, công tác..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherClassStudentList;
