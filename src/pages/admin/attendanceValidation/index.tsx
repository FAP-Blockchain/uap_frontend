import React, { useEffect, useState } from "react";
import { Card, Space, Typography, Button, Table, Tag, Tabs } from "antd";
import { toast } from "react-toastify";
import { CheckCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import AttendanceValidationAdminService from "../../../services/admin/attendanceValidation/api";
import type { AttendanceValidationStatus } from "../../../services/admin/attendanceValidation/api";
import "./index.scss";

const { Title, Text } = Typography;

const AttendanceValidationAdminPage: React.FC = () => {
  const [status, setStatus] = useState<AttendanceValidationStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const loadStatus = async () => {
    setLoadingStatus(true);
    setError(null);
    try {
      const data = await AttendanceValidationAdminService.getStatus();
      setStatus(data);
    } catch (err) {
      console.error("Không thể tải trạng thái validate ngày điểm danh:", err);
      setError("Không thể tải trạng thái validate ngày điểm danh.");
      setStatus(null);
    } finally {
      setLoadingStatus(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    void loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async (enabled: boolean) => {
    setUpdating(true);
    setError(null);
    try {
      const updated = await AttendanceValidationAdminService.updateStatus(
        enabled
      );
      setStatus(updated);
      const message =
        updated.enabled === true
          ? "Đã BẬT kiểm tra ngày điểm danh."
          : "Đã TẮT kiểm tra ngày điểm danh.";
      toast.success(message);
    } catch (err) {
      console.error(
        "Không thể cập nhật trạng thái validate ngày điểm danh:",
        err
      );
      setError("Không thể cập nhật trạng thái validate ngày điểm danh.");
    } finally {
      setUpdating(false);
    }
  };

  // Fake data for "Giả định dữ liệu" tab
  const fakeData = [
    {
      key: "1",
      constraint: "Ngày điểm danh không được quá 7 ngày so với ngày hiện tại",
      attendanceDate: "2025-12-05",
    },
    {
      key: "2",
      constraint: "Không thể điểm danh cho các ngày trong tương lai",
      attendanceDate: "2025-12-06",
    },
    {
      key: "3",
      constraint: "Ngày điểm danh phải trong học kỳ hiện tại",
      attendanceDate: "2025-12-07",
    },
  ];

  const fakeDataColumns = [
    {
      title: "Ràng buộc",
      dataIndex: "constraint",
      key: "constraint",
      width: "60%",
    },
    {
      title: "Ngày điểm danh",
      dataIndex: "attendanceDate",
      key: "attendanceDate",
      width: "40%",
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("vi-VN");
        return <span>{formattedDate}</span>;
      },
    },
  ];

  const configurationColumns = [
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "50%",
      align: "center" as const,
      render: () => {
        if (error) {
          return <Tag color="red">Lỗi tải dữ liệu</Tag>;
        }
        if (loadingStatus) {
          return <Tag>Đang tải...</Tag>;
        }
        if (!initialized || status === null) {
          return <Tag>Chưa có dữ liệu</Tag>;
        }
        return status.enabled ? (
          <Tag color="green">Đang BẬT</Tag>
        ) : (
          <Tag color="orange">Đang TẮT</Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "50%",
      align: "center" as const,
      render: () => (
        <Space>
          <Button
            size="small"
            type="primary"
            disabled={updating}
            loading={updating}
            onClick={() => void handleUpdate(true)}
          >
            Bật validate
          </Button>
          <Button
            size="small"
            danger
            disabled={updating}
            loading={updating}
            onClick={() => void handleUpdate(false)}
          >
            Tắt validate
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "configuration",
      label: "Cấu hình",
      children: (
        <Card
          title={
            <Space align="center">
              <CalendarOutlined />
              <span>Kiểm tra ngày điểm danh</span>
            </Space>
          }
        >
          <Table
            className="attendance-validation-table"
            pagination={false}
            size="middle"
            columns={configurationColumns}
            dataSource={[
              {
                key: "attendance-validation-status",
                status,
              },
            ]}
          />
        </Card>
      ),
    },
    {
      key: "fake-data",
      label: "Giả định dữ liệu",
      children: (
        <Card
          title={
            <Space align="center">
              <CalendarOutlined />
              <span>Giả định dữ liệu điểm danh</span>
            </Space>
          }
        >
          <Table
            className="attendance-validation-table"
            pagination={false}
            size="middle"
            columns={fakeDataColumns}
            dataSource={fakeData}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="attendance-validation-page">
      <div className="page-header">
        <Space align="center" size={12}>
          <div className="icon-wrapper">
            <CheckCircleOutlined />
          </div>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Cấu hình và giả định dữ liệu
            </Title>
            <Text type="secondary">
              Quản lý việc cho phép hay khóa điểm danh theo từng ngày.
            </Text>
          </div>
        </Space>
      </div>

      <Tabs items={tabItems} defaultActiveKey="configuration" />
    </div>
  );
};

export default AttendanceValidationAdminPage;
