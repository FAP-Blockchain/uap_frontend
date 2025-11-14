import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Row,
  Col,
  Select,
  Space,
  Table,
  Tag,
  Popconfirm,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  BookOutlined,
  CalendarOutlined,
  CompressOutlined,
  ExpandAltOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./index.scss";
import type {
  ClassSummary,
  CreateClassRequest,
  UpdateClassRequest,
} from "../../../types/Class";
import type { SubjectDto } from "../../../types/Subject";
import type { TeacherOption } from "../../../types/Teacher";
import {
  createClassApi,
  fetchClassesApi,
  fetchSubjectsApi,
  fetchTeachersApi,
  getClassByIdApi,
  updateClassApi,
  deleteClassApi,
} from "../../../services/admin/classes/api";

const { Search } = Input;
const { Option } = Select;

const ClassesManagement: React.FC = () => {
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [showDetails, setShowDetails] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSummary | null>(null);
  const [form] = Form.useForm<CreateClassRequest>();

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [classRes, subjectRes, teacherRes] = await Promise.all([
        fetchClassesApi(),
        fetchSubjectsApi(),
        fetchTeachersApi(),
      ]);
      setClasses(classRes);
      setSubjects(subjectRes);
      setTeachers(teacherRes);
    } catch (error) {
      message.error("Không thể tải dữ liệu lớp học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const semesterOptions = useMemo(() => {
    const semesters = Array.from(
      new Set(classes.map((cls) => cls.semesterName))
    );
    return semesters.sort((a, b) => a.localeCompare(b));
  }, [classes]);

  const stats = useMemo(() => {
    const total = classes.length;
    const totalStudents = classes.reduce(
      (sum, cls) => sum + (cls.totalStudents || 0),
      0
    );
    const totalSlots = classes.reduce(
      (sum, cls) => sum + (cls.totalSlots || 0),
      0
    );
    const totalEnrollments = classes.reduce(
      (sum, cls) => sum + (cls.totalEnrollments || 0),
      0
    );
    return {
      total,
      totalStudents,
      totalSlots,
      totalEnrollments,
    };
  }, [classes]);

  const statsCards = [
    {
      label: "Tổng lớp học",
      value: stats.total,
      accent: "total",
      icon: <BookOutlined />,
    },
    {
      label: "Tổng sinh viên",
      value: stats.totalStudents,
      accent: "students",
      icon: <UserOutlined />,
    },
    {
      label: "Đăng ký",
      value: stats.totalEnrollments,
      accent: "enrollments",
      icon: <CalendarOutlined />,
    },
    {
      label: "Số chỗ",
      value: stats.totalSlots,
      accent: "slots",
      icon: <BookOutlined />,
    },
  ];

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesSearch =
        searchText.trim() === "" ||
        cls.classCode.toLowerCase().includes(searchText.toLowerCase()) ||
        cls.subjectName.toLowerCase().includes(searchText.toLowerCase()) ||
        cls.teacherName.toLowerCase().includes(searchText.toLowerCase());
      const matchesSemester =
        semesterFilter === "all" || cls.semesterName === semesterFilter;
      return matchesSearch && matchesSemester;
    });
  }, [classes, searchText, semesterFilter]);

  const columns: ColumnsType<ClassSummary> = [
    {
      title: "Lớp học",
      key: "classInfo",
      render: (_, record) => (
        <div className="class-info">
          <div className="class-info__header">
            <BookOutlined className="class-info__icon" />
            <div>
              <div className="class-info__code">{record.classCode}</div>
              <div className="class-info__subject">
                {record.subjectCode} · {record.subjectName}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giảng viên",
      dataIndex: "teacherName",
      key: "teacherName",
      render: (teacherName: string, record) => (
        <Space>
          <UserOutlined className="teacher-icon" />
          <span>
            {teacherName} ({record.teacherCode})
          </span>
        </Space>
      ),
    },
    {
      title: "Kỳ học",
      dataIndex: "semesterName",
      key: "semesterName",
      render: (semesterName: string) => (
        <Tag color="processing" className="semester-tag">
          {semesterName}
        </Tag>
      ),
    },
    {
      title: "Tín chỉ",
      dataIndex: "credits",
      key: "credits",
      align: "center",
      render: (credits: number) => (
        <Tag color="purple" className="credit-tag">
          {credits}
        </Tag>
      ),
    },
    {
      title: "Sĩ số",
      key: "capacity",
      render: (_, record) => (
        <div className="capacity">
          <span className="capacity__value">{record.totalStudents}</span>
          <span className="capacity__label">Sinh viên</span>
        </div>
      ),
    },
    {
      title: "Đăng ký",
      key: "enrollments",
      render: (_, record) => (
        <div className="capacity">
          <span className="capacity__value">{record.totalEnrollments}</span>
          <span className="capacity__label">Lượt</span>
        </div>
      ),
    },
    {
      title: "Chỗ trống",
      key: "slots",
      render: (_, record) => (
        <div className="capacity">
          <span className="capacity__value">{record.totalSlots}</span>
          <span className="capacity__label">Chỗ</span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa lớp học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = async (classItem: ClassSummary) => {
    try {
      setLoading(true);
      const classDetail = await getClassByIdApi(classItem.id);
      setEditingClass(classDetail);
      
      // Find subject and teacher IDs from the current data
      const subject = subjects.find(
        (s) => s.subjectCode === classItem.subjectCode
      );
      const teacher = teachers.find(
        (t) => t.teacherCode === classItem.teacherCode
      );

      form.setFieldsValue({
        classCode: classDetail.classCode,
        subjectId: subject?.id,
        teacherId: teacher?.id,
      });
      setIsModalVisible(true);
    } catch (error) {
      message.error("Không thể tải thông tin lớp học");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteClassApi(id);
      message.success("Xóa lớp học thành công");
      await loadInitialData();
    } catch (error) {
      message.error("Không thể xóa lớp học");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      
      if (editingClass) {
        await updateClassApi(editingClass.id, values);
        message.success("Cập nhật lớp học thành công");
      } else {
        await createClassApi(values);
        message.success("Tạo lớp học thành công");
      }
      
      setIsModalVisible(false);
      setEditingClass(null);
      form.resetFields();
      await loadInitialData();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error(
          editingClass
            ? "Không thể cập nhật lớp học"
            : "Không thể tạo lớp học mới"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingClass(null);
    form.resetFields();
  };

  return (
    <div className="classes-management">
      <Card className="classes-panel">
        <div className="overview-header">
          <div className="title-block">
            <div className="title-icon">
              <BookOutlined />
            </div>
            <div>
              <p className="eyebrow">Bảng quản trị</p>
              <h2>Quản lý Lớp học</h2>
              <span className="subtitle">
                Theo dõi và cập nhật tình trạng các lớp học trong hệ thống
              </span>
            </div>
          </div>
          <div className="header-actions">
            <Button
              className="toggle-details-btn"
              icon={showDetails ? <CompressOutlined /> : <ExpandAltOutlined />}
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? "Thu gọn" : "Chi tiết"}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="primary-action"
              onClick={() => {
                setEditingClass(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Thêm lớp học
            </Button>
          </div>
        </div>

        <div className="stats-compact">
          {statsCards.map((stat) => (
            <div key={stat.label} className={`stat-chip ${stat.accent}`}>
              <span className="chip-icon">{stat.icon}</span>
              <span className="value">{stat.value}</span>
              <span className="label">{stat.label}</span>
            </div>
          ))}
        </div>

        {showDetails && (
          <div className="stats-inline">
            {statsCards.map((stat) => (
              <div key={stat.label} className={`stat-item ${stat.accent}`}>
                <div className="stat-icon-wrapper">{stat.icon}</div>
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className={`filters-row ${
            showDetails ? "expanded" : "compact-layout"
          }`}
        >
          <Row gutter={showDetails ? 16 : 12} align="middle">
            <Col xs={showDetails ? 12 : 24} sm={showDetails ? 16 : 24}>
              {showDetails && <label>Tìm kiếm lớp học</label>}
              <Search
                placeholder="Tìm theo mã lớp, môn học hoặc giảng viên..."
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
                prefix={<SearchOutlined />}
                size={showDetails ? "large" : "middle"}
              />
            </Col>
            <Col xs={showDetails ? 6 : 12} sm={showDetails ? 4 : 12}>
              {showDetails && <label>Kỳ học</label>}
              <Select
                value={semesterFilter}
                onChange={setSemesterFilter}
                size={showDetails ? "large" : "middle"}
                className="semester-select"
              >
                <Option value="all">Tất cả</Option>
                {semesterOptions.map((semester) => (
                  <Option key={semester} value={semester}>
                    {semester}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={showDetails ? 6 : 12} sm={showDetails ? 4 : 12}>
              {showDetails && <label>Lớp hiển thị</label>}
              <div className="filter-meta text-right">
                {filteredClasses.length} / {classes.length}
              </div>
            </Col>
          </Row>
        </div>

        <div className="table-section">
          <Table
            columns={columns}
            dataSource={filteredClasses}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} lớp`,
            }}
            scroll={{ x: 900 }}
          />
        </div>
      </Card>

      <Modal
        title={editingClass ? "Chỉnh sửa lớp học" : "Tạo lớp học mới"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleModalCancel}
        okText={editingClass ? "Cập nhật" : "Tạo lớp"}
        cancelText="Hủy"
        confirmLoading={isSubmitting}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            classCode: "",
            subjectId: undefined,
            teacherId: undefined,
          }}
        >
          <Form.Item
            name="classCode"
            label="Mã lớp học"
            rules={[{ required: true, message: "Vui lòng nhập mã lớp học" }]}
          >
            <Input placeholder="VD: AI401-A" />
          </Form.Item>

          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
          >
            <Select
              placeholder="Chọn môn học"
              showSearch
              optionFilterProp="label"
            >
              {subjects.map((subject) => (
                <Option
                  key={subject.id}
                  value={subject.id}
                  label={`${subject.subjectCode} ${subject.subjectName}`}
                >
                  {subject.subjectCode} - {subject.subjectName} (
                  {subject.credits} tín chỉ)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="teacherId"
            label="Giảng viên"
            rules={[{ required: true, message: "Vui lòng chọn giảng viên" }]}
          >
            <Select
              placeholder="Chọn giảng viên"
              showSearch
              optionFilterProp="label"
            >
              {teachers.map((teacher) => (
                <Option
                  key={teacher.id}
                  value={teacher.id}
                  label={`${teacher.teacherCode} ${teacher.fullName}`}
                >
                  {teacher.teacherCode} - {teacher.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassesManagement;
