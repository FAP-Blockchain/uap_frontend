import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AppstoreOutlined,
  BookOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import type {
  AddSubjectToCurriculumRequest,
  CreateCurriculumRequest,
  CurriculumDetailDto,
  CurriculumListItem,
  CurriculumSubjectDto,
  UpdateCurriculumRequest,
} from "../../../types/Curriculum";
import type { SubjectDto } from "../../../types/Subject";
import {
  addSubjectToCurriculumApi,
  createCurriculumApi,
  deleteCurriculumApi,
  fetchCurriculumsApi,
  getCurriculumByIdApi,
  removeSubjectFromCurriculumApi,
  updateCurriculumApi,
} from "../../../services/admin/curriculums/api";
import { fetchSubjectsApi } from "../../../services/admin/subjects/api";
import "./index.scss";

const { Search } = Input;
const { Option } = Select;

type SortOption = "recent" | "subject" | "credits";

const CurriculumManagementPage: React.FC = () => {
  const [curriculums, setCurriculums] = useState<CurriculumListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCurriculum, setEditingCurriculum] =
    useState<CurriculumListItem | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] =
    useState<CurriculumDetailDto | null>(null);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState<SubjectDto[]>([]);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [subjectSubmitting, setSubjectSubmitting] = useState(false);

  const [form] = Form.useForm<CreateCurriculumRequest>();
  const [subjectForm] = Form.useForm<AddSubjectToCurriculumRequest>();

  const loadCurriculums = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCurriculumsApi();
      setCurriculums(data);
    } catch (error) {
      console.error("Failed to load curriculums", error);
      toast.error("Không thể tải danh sách khung chương trình");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurriculums();
  }, [loadCurriculums]);

  const loadCurriculumDetail = useCallback(async (id: number) => {
    setDetailLoading(true);
    try {
      const detail = await getCurriculumByIdApi(id);
      setSelectedCurriculum(detail);
    } catch (error) {
      console.error("Failed to load curriculum detail", error);
      toast.error("Không thể tải chi tiết khung chương trình");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const loadSubjectOptions = useCallback(async () => {
    setSubjectLoading(true);
    try {
      const response = await fetchSubjectsApi({
        pageSize: 100,
        pageNumber: 1,
      });
      setSubjectOptions(response.data);
    } catch (error) {
      console.error("Failed to load subjects", error);
      toast.error("Không thể tải danh sách môn học");
    } finally {
      setSubjectLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subjectModalOpen && subjectOptions.length === 0) {
      loadSubjectOptions();
    }
  }, [subjectModalOpen, subjectOptions.length, loadSubjectOptions]);

  const stats = useMemo(() => {
    const total = curriculums.length;
    const totalCredits = curriculums.reduce(
      (sum, item) => sum + (item.totalCredits || 0),
      0
    );
    const totalSubjects = curriculums.reduce(
      (sum, item) => sum + (item.subjectCount || 0),
      0
    );
    const totalStudents = curriculums.reduce(
      (sum, item) => sum + (item.studentCount || 0),
      0
    );
    return { total, totalCredits, totalSubjects, totalStudents };
  }, [curriculums]);

  const filteredCurriculums = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const filtered = curriculums.filter((item) => {
      if (!keyword) return true;
      return (
        item.code.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        (item.description || "").toLowerCase().includes(keyword)
      );
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "subject":
          return b.subjectCount - a.subjectCount;
        case "credits":
          return b.totalCredits - a.totalCredits;
        default:
          return b.id - a.id;
      }
    });
  }, [curriculums, searchTerm, sortOption]);

  const groupedSubjects = useMemo(() => {
    if (!selectedCurriculum) return [];
    const map = selectedCurriculum.subjects.reduce<
      Record<number, CurriculumSubjectDto[]>
    >((acc, subject) => {
      const semester = subject.semesterNumber || 0;
      if (!acc[semester]) {
        acc[semester] = [];
      }
      acc[semester].push(subject);
      return acc;
    }, {});
    return Object.entries(map)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([semester, subjects]) => ({
        semester: Number(semester),
        subjects,
      }));
  }, [selectedCurriculum]);

  const openCreateModal = () => {
    setEditingCurriculum(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (record: CurriculumListItem) => {
    setEditingCurriculum(record);
    form.setFieldsValue({
      code: record.code,
      name: record.name,
      description: record.description,
      totalCredits: record.totalCredits,
    });
    setIsModalVisible(true);
  };

  const handleSubmitCurriculum = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      if (editingCurriculum) {
        await updateCurriculumApi(editingCurriculum.id, values);
        toast.success("Cập nhật khung chương trình thành công");
      } else {
        await createCurriculumApi(values);
        toast.success("Tạo khung chương trình thành công");
      }
      setIsModalVisible(false);
      loadCurriculums();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCurriculum = (record: CurriculumListItem) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc muốn xóa khung chương trình ${record.code}?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await deleteCurriculumApi(record.id);
          toast.success("Đã xóa khung chương trình");
          loadCurriculums();
        } catch {
          toast.error("Không thể xóa khung chương trình");
        }
      },
    });
  };

  const handleViewDetail = async (record: CurriculumListItem) => {
    setDetailDrawerOpen(true);
    await loadCurriculumDetail(record.id);
  };

  const openSubjectModal = () => {
    subjectForm.resetFields();
    setSubjectModalOpen(true);
  };

  const handleAddSubject = async () => {
    if (!selectedCurriculum) return;
    try {
      const values = await subjectForm.validateFields();
      setSubjectSubmitting(true);
      await addSubjectToCurriculumApi(selectedCurriculum.id, values);
      toast.success("Đã thêm môn vào khung chương trình");
      setSubjectModalOpen(false);
      subjectForm.resetFields();
      await loadCurriculumDetail(selectedCurriculum.id);
      await loadCurriculums();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setSubjectSubmitting(false);
    }
  };

  const handleRemoveSubject = async (subjectId: string) => {
    if (!selectedCurriculum) return;
    Modal.confirm({
      title: "Xóa môn khỏi khung?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await removeSubjectFromCurriculumApi(
            selectedCurriculum.id,
            subjectId
          );
          toast.success("Đã xóa môn khỏi khung chương trình");
          await loadCurriculumDetail(selectedCurriculum.id);
          loadCurriculums();
        } catch {
          toast.error("Không thể xóa môn học");
        }
      },
    });
  };

  const columns: ColumnsType<CurriculumListItem> = [
    {
      title: "Khung chương trình",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="curriculum-info">
          <div className="curriculum-code">{record.code}</div>
          <div className="curriculum-name">{record.name}</div>
          {record.description && (
            <div className="curriculum-description">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: "Tổng tín chỉ",
      dataIndex: "totalCredits",
      key: "credits",
      width: 140,
      render: (value) => <Tag color="blue">{value} tín chỉ</Tag>,
    },
    {
      title: "Môn học",
      dataIndex: "subjectCount",
      key: "subjects",
      width: 120,
      render: (value) => (
        <Tag icon={<BookOutlined />} color="geekblue">
          {value} môn
        </Tag>
      ),
    },
    {
      title: "Sinh viên",
      dataIndex: "studentCount",
      key: "students",
      width: 130,
      render: (value) => (
        <Tag color="green" icon={<AppstoreOutlined />}>
          {value || 0}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
          <Button type="link" onClick={() => openEditModal(record)}>
            Chỉnh sửa
          </Button>
          <Tooltip title="Xóa khung chương trình">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCurriculum(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="curriculum-management">
      <Card className="curriculum-panel">
        <div className="panel-header">
          <div className="panel-title">
            <div className="icon-wrapper">
              <AppstoreOutlined />
            </div>
            <div>
              <p className="eyebrow">Chương trình đào tạo</p>
              <h2>Quản lý Khung chương trình</h2>
              <span>Kiểm soát danh sách khung, tín chỉ và cấu trúc môn học</span>
            </div>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadCurriculums}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Khung chương trình mới
            </Button>
          </Space>
        </div>

        <div className="stats-row">
          <div className="stat-item total">
            <div className="stat-icon">
              <AppstoreOutlined />
            </div>
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Khung chương trình</div>
            </div>
          </div>
          <div className="stat-item credits">
            <div className="stat-icon">
              <SettingOutlined />
            </div>
            <div>
              <div className="stat-value">{stats.totalCredits}</div>
              <div className="stat-label">Tổng tín chỉ</div>
            </div>
          </div>
          <div className="stat-item subjects">
            <div className="stat-icon">
              <BookOutlined />
            </div>
            <div>
              <div className="stat-value">{stats.totalSubjects}</div>
              <div className="stat-label">Môn học</div>
            </div>
          </div>
          <div className="stat-item students">
            <div className="stat-icon">
              <AppstoreOutlined />
            </div>
            <div>
              <div className="stat-value">{stats.totalStudents}</div>
              <div className="stat-label">Sinh viên áp dụng</div>
            </div>
          </div>
        </div>

        <div className="filter-row">
          <Search
            allowClear
            placeholder="Tìm theo tên, mã hoặc mô tả khung"
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            prefix={<SearchOutlined />}
          />
          <Select
            value={sortOption}
            onChange={(value: SortOption) => setSortOption(value)}
            style={{ width: 220 }}
          >
            <Option value="recent">Mới nhất</Option>
            <Option value="subject">Nhiều môn học</Option>
            <Option value="credits">Tín chỉ cao</Option>
          </Select>
        </div>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filteredCurriculums}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{
            emptyText: (
              <Empty description="Chưa có khung chương trình" />
            ),
          }}
        />
      </Card>

      <Drawer
        title={selectedCurriculum?.name || "Chi tiết khung chương trình"}
        placement="right"
        width={520}
        open={detailDrawerOpen}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedCurriculum(null);
        }}
        extra={
          selectedCurriculum && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openSubjectModal}>
              Thêm môn học
            </Button>
          )
        }
      >
        {detailLoading ? (
          <div className="drawer-loading">
            <Spin />
          </div>
        ) : selectedCurriculum ? (
          <div className="drawer-content">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã chương trình">
                {selectedCurriculum.code}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tín chỉ">
                {selectedCurriculum.totalCredits}
              </Descriptions.Item>
              <Descriptions.Item label="Số môn học">
                {selectedCurriculum.subjectCount}
              </Descriptions.Item>
              <Descriptions.Item label="Số sinh viên">
                {selectedCurriculum.studentCount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {selectedCurriculum.description || "Chưa có mô tả"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <h4>Cấu trúc môn học</h4>
            {groupedSubjects.length === 0 ? (
              <Empty description="Chưa có môn học nào trong khung" />
            ) : (
              groupedSubjects.map((group) => (
                <div className="semester-block" key={group.semester}>
                  <div className="semester-header">
                    <span>Học kỳ {group.semester}</span>
                    <Tag color="blue">{group.subjects.length} môn</Tag>
                  </div>
                  <div className="semester-body">
                    {group.subjects.map((subject) => (
                      <div className="subject-item" key={subject.id}>
                        <div>
                          <div className="subject-name">
                            {subject.subjectCode} - {subject.subjectName}
                          </div>
                          <div className="subject-meta">
                            <Tag color="geekblue">{subject.credits} tín chỉ</Tag>
                            {subject.prerequisiteSubjectCode && (
                              <Tag color="purple">
                                Tiên quyết: {subject.prerequisiteSubjectCode}
                              </Tag>
                            )}
                          </div>
                        </div>
                        <Tooltip title="Xóa môn khỏi khung">
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() =>
                              handleRemoveSubject(subject.subjectId)
                            }
                          />
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <Empty description="Chọn một khung chương trình để xem chi tiết" />
        )}
      </Drawer>

      <Modal
        open={isModalVisible}
        title={
          editingCurriculum ? "Chỉnh sửa khung chương trình" : "Khung chương trình mới"
        }
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmitCurriculum}
        confirmLoading={isSubmitting}
        okText={editingCurriculum ? "Lưu thay đổi" : "Tạo mới"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mã khung"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã khung" }]}
          >
            <Input placeholder="Ví dụ: SE-PRO-2024" />
          </Form.Item>
          <Form.Item
            label="Tên khung"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên khung" }]}
          >
            <Input placeholder="Tên chương trình đào tạo" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về khung" />
          </Form.Item>
          <Form.Item
            label="Tổng tín chỉ"
            name="totalCredits"
            rules={[{ required: true, message: "Vui lòng nhập số tín chỉ" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={subjectModalOpen}
        title="Thêm môn vào khung chương trình"
        onCancel={() => setSubjectModalOpen(false)}
        onOk={handleAddSubject}
        okText="Thêm môn"
        confirmLoading={subjectSubmitting}
      >
        {subjectLoading ? (
          <div className="modal-loading">
            <Spin />
          </div>
        ) : subjectOptions.length === 0 ? (
          <Alert
            type="warning"
            showIcon
            message="Không tìm thấy dữ liệu môn học"
            description="Hãy tạo môn học trước khi thêm vào khung chương trình."
          />
        ) : (
          <Form form={subjectForm} layout="vertical">
            <Form.Item
              label="Môn học"
              name="subjectId"
              rules={[{ required: true, message: "Vui lòng chọn môn" }]}
            >
              <Select
                showSearch
                placeholder="Chọn môn học"
                optionFilterProp="label"
                options={subjectOptions.map((subject) => ({
                  label: `${subject.subjectCode} - ${subject.subjectName}`,
                  value: subject.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Học kỳ"
              name="semesterNumber"
              rules={[{ required: true, message: "Vui lòng nhập học kỳ" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            {selectedCurriculum && selectedCurriculum.subjects.length > 0 && (
              <Form.Item label="Môn tiên quyết" name="prerequisiteSubjectId">
                <Select
                  allowClear
                  placeholder="Chọn môn tiên quyết (nếu có)"
                  options={selectedCurriculum.subjects.map((subject) => ({
                    label: `${subject.subjectCode} - ${subject.subjectName}`,
                    value: subject.subjectId,
                  }))}
                />
              </Form.Item>
            )}
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default CurriculumManagementPage;
