import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  LinkOutlined,
  QrcodeOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  ShareAltOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import "./Dashboard.scss";

const { Title, Text, Paragraph } = Typography;

interface CredentialSummary {
  id: string;
  type: "degree" | "transcript" | "certificate";
  title: string;
  institution: string;
  issueDate: string;
  status: "active" | "pending" | "revoked";
  blockchainHash?: string;
  gpa?: string;
}

interface DashboardStats {
  totalCredentials: number;
  verifiedCredentials: number;
  pendingCredentials: number;
  recentVerifications: number;
}

interface ActivityItem {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  type: "verification" | "share" | "credential" | "profile";
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const dashboardStats: DashboardStats = {
    totalCredentials: 8,
    verifiedCredentials: 6,
    pendingCredentials: 2,
    recentVerifications: 15,
  };

  // Data for line chart - Credentials over time
  const credentialsOverTime = [
    { month: "Tháng 1", credentials: 2 },
    { month: "Tháng 2", credentials: 3 },
    { month: "Tháng 3", credentials: 4 },
    { month: "Tháng 4", credentials: 5 },
    { month: "Tháng 5", credentials: 6 },
    { month: "Tháng 6", credentials: 8 },
  ];

  // Data for bar chart - Credentials by type
  const credentialsByType = [
    { type: "Bằng cấp", count: 3, color: "#52c41a" },
    { type: "Chứng chỉ", count: 4, color: "#1890ff" },
    { type: "Bảng điểm", count: 1, color: "#722ed1" },
  ];

  // Data for pie chart - Status distribution
  const statusData = [
    { name: "Hoạt động", value: 6, color: "#52c41a" },
    { name: "Đang chờ", value: 2, color: "#faad14" },
    { name: "Đã thu hồi", value: 0, color: "#ff4d4f" },
  ];

  // Data for area chart - Verifications over time
  const verificationsOverTime = [
    { month: "Tháng 1", verifications: 2 },
    { month: "Tháng 2", verifications: 5 },
    { month: "Tháng 3", verifications: 8 },
    { month: "Tháng 4", verifications: 10 },
    { month: "Tháng 5", verifications: 12 },
    { month: "Tháng 6", verifications: 15 },
  ];

  // Data for mini chart in stat cards
  const monthlyGrowth = [
    { month: "T2", value: 2 },
    { month: "T3", value: 3 },
    { month: "T4", value: 4 },
    { month: "T5", value: 3 },
    { month: "T6", value: 5 },
    { month: "T7", value: 4 },
    { month: "CN", value: 6 },
  ];

  const recentCredentials: CredentialSummary[] = [
    {
      id: "deg_001",
      type: "degree",
      title: "Bachelor of Software Engineering",
      institution: "FPT University",
      issueDate: "2024-06-15",
      status: "active",
      blockchainHash: "0x1a2b3c4d...",
      gpa: "3.85",
    },
    {
      id: "cert_001",
      type: "certificate",
      title: "AWS Cloud Practitioner",
      institution: "Amazon Web Services",
      issueDate: "2024-03-22",
      status: "active",
      blockchainHash: "0x5e6f7g8h...",
    },
    {
      id: "trans_001",
      type: "transcript",
      title: "Academic Transcript - Fall 2023",
      institution: "FPT University",
      issueDate: "2024-01-10",
      status: "active",
      blockchainHash: "0x9i0j1k2l...",
      gpa: "3.75",
    },
    {
      id: "cert_002",
      type: "certificate",
      title: "React Advanced Certification",
      institution: "Meta",
      issueDate: "2024-02-28",
      status: "pending",
    },
  ];

  const recentActivities: ActivityItem[] = [
    {
      id: 1,
      action: "Chứng chỉ đã được xác thực",
      description: "Bằng cử nhân của bạn đã được xác thực bởi TechCorp Vietnam",
      timestamp: "2 giờ trước",
      type: "verification",
    },
    {
      id: 2,
      action: "Mã QR đã được tạo",
      description: "Mã QR đã được tạo cho chứng chỉ AWS Cloud Practitioner",
      timestamp: "1 ngày trước",
      type: "share",
    },
    {
      id: 3,
      action: "Chứng chỉ mới được cấp",
      description: "Bảng điểm học kỳ Spring 2024 đã được cấp",
      timestamp: "3 ngày trước",
      type: "credential",
    },
    {
      id: 4,
      action: "Hồ sơ đã được cập nhật",
      description: "Thông tin liên hệ đã được cập nhật thành công",
      timestamp: "1 tuần trước",
      type: "profile",
    },
  ];

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case "degree":
        return <TrophyOutlined style={{ color: "#52c41a" }} />;
      case "certificate":
        return <SafetyCertificateOutlined style={{ color: "#1890ff" }} />;
      case "transcript":
        return <BookOutlined style={{ color: "#722ed1" }} />;
      default:
        return <FileTextOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "active":
        return <Tag color="success">Hoạt động</Tag>;
      case "pending":
        return <Tag color="warning">Đang chờ</Tag>;
      case "revoked":
        return <Tag color="error">Đã thu hồi</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "verification":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "share":
        return <ShareAltOutlined style={{ color: "#1890ff" }} />;
      case "credential":
        return <FileTextOutlined style={{ color: "#722ed1" }} />;
      case "profile":
        return <Avatar size="small" icon={<UserOutlined />} />;
      default:
        return <EyeOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  const handleCredentialClick = (credentialId: string) => {
    navigate(`/student-portal/credentials/${credentialId}`);
  };

  // Custom tooltip for charts
  interface TooltipPayload {
    name: string;
    value: number;
    color: string;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: "4px 0", color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="antd-dashboard">
      {/* Welcome Header */}
      <Card className="welcome-card" style={{ marginBottom: 24 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ margin: 0, color: "white" }}>
              Chào mừng trở lại!
            </Title>
            <Text style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.9)" }}>
              Đây là những gì đang diễn ra với chứng chỉ của bạn hôm nay.
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                size="large"
                icon={<ShareAltOutlined />}
                onClick={() => navigate("/student-portal/share")}
                className="share-btn-outline"
              >
                Chia sẻ chứng chỉ
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<QrcodeOutlined />}
                onClick={() => navigate("/student-portal/share")}
                className="generate-btn-gradient"
              >
                Tạo mã QR
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards with Mini Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Tổng số chứng chỉ"
              value={dashboardStats.totalCredentials}
              prefix={<FileTextOutlined style={{ color: "#1a94fc" }} />}
              suffix={
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  +2 tháng này
                </Tag>
              }
            />
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={monthlyGrowth}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#1a94fc"
                    fill="#1a94fc"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Chứng chỉ đã xác thực"
              value={dashboardStats.verifiedCredentials}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              suffix={
                <Progress
                  type="circle"
                  size={30}
                  percent={Math.round(
                    (dashboardStats.verifiedCredentials /
                      dashboardStats.totalCredentials) *
                      100
                  )}
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              }
            />
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={monthlyGrowth}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#52c41a"
                    fill="#52c41a"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Đang chờ xem xét"
              value={dashboardStats.pendingCredentials}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              suffix={<Tag color="orange">Đang xử lý</Tag>}
            />
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={monthlyGrowth}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#faad14"
                    fill="#faad14"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Xác thực gần đây"
              value={dashboardStats.recentVerifications}
              prefix={<EyeOutlined style={{ color: "#722ed1" }} />}
              suffix={
                <RiseOutlined style={{ color: "#52c41a", fontSize: 16 }} />
              }
            />
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={monthlyGrowth}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#722ed1"
                    fill="#722ed1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* Credentials Over Time - Line Chart */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ color: "#1a94fc" }} />
                <Text strong>Tăng trưởng chứng chỉ</Text>
              </Space>
            }
            hoverable
            className="chart-card"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={credentialsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#8c8c8c"
                  style={{ fontSize: 12 }}
                />
                <YAxis stroke="#8c8c8c" style={{ fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="credentials"
                  stroke="#1a94fc"
                  strokeWidth={3}
                  dot={{ fill: "#1a94fc", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Credentials by Type - Bar Chart */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: "#1a94fc" }} />
                <Text strong>Chứng chỉ theo loại</Text>
              </Space>
            }
            hoverable
            className="chart-card"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={credentialsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="type"
                  stroke="#8c8c8c"
                  style={{ fontSize: 12 }}
                />
                <YAxis stroke="#8c8c8c" style={{ fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {credentialsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* Status Distribution - Pie Chart */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined style={{ color: "#1a94fc" }} />
                <Text strong>Phân bổ trạng thái</Text>
              </Space>
            }
            hoverable
            className="chart-card"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const name = props.name || "";
                    const percent =
                      (props as { percent?: number }).percent || 0;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Verifications Over Time - Area Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <EyeOutlined style={{ color: "#1a94fc" }} />
                <Text strong>Xu hướng xác thực</Text>
              </Space>
            }
            hoverable
            className="chart-card"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={verificationsOverTime}>
                <defs>
                  <linearGradient
                    id="colorVerifications"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#1a94fc" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1a94fc" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#8c8c8c"
                  style={{ fontSize: 12 }}
                />
                <YAxis stroke="#8c8c8c" style={{ fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="verifications"
                  stroke="#1a94fc"
                  strokeWidth={3}
                  fill="url(#colorVerifications)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Main Content Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* Recent Credentials */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: "#1a94fc" }} />
                <Text strong>Chứng chỉ gần đây</Text>
              </Space>
            }
            extra={
              <Button
                type="link"
                onClick={() => navigate("/student-portal/credentials")}
              >
                Xem tất cả →
              </Button>
            }
            hoverable
          >
            <List
              dataSource={recentCredentials}
              renderItem={(credential) => (
                <List.Item
                  onClick={() => handleCredentialClick(credential.id)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: "12px 16px",
                    borderRadius: "8px",
                  }}
                  className="credential-list-item"
                  actions={[
                    getStatusTag(credential.status),
                    credential.blockchainHash && (
                      <Tooltip
                        title={`Blockchain: ${credential.blockchainHash}`}
                      >
                        <Badge dot color="green">
                          <LinkOutlined style={{ color: "#52c41a" }} />
                        </Badge>
                      </Tooltip>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size="large"
                        icon={getCredentialIcon(credential.type)}
                        style={{
                          backgroundColor: "#f6f8ff",
                          border: "1px solid #d9e5ff",
                        }}
                      />
                    }
                    title={
                      <div>
                        <Text strong>{credential.title}</Text>
                        {credential.gpa && (
                          <Tag color="gold" style={{ marginLeft: 8 }}>
                            GPA: {credential.gpa}
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary">{credential.institution}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Cấp ngày:{" "}
                          {new Date(credential.issueDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <EyeOutlined style={{ color: "#722ed1" }} />
                <Text strong>Hoạt động gần đây</Text>
              </Space>
            }
            extra={<Button type="link">Xem tất cả →</Button>}
            hoverable
          >
            <List
              dataSource={recentActivities}
              renderItem={(activity) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size="default"
                        style={{
                          backgroundColor: "#f6f8ff",
                          border: "1px solid #d9e5ff",
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    }
                    title={<Text strong>{activity.action}</Text>}
                    description={
                      <div>
                        <Paragraph
                          ellipsis={{ rows: 1, expandable: false }}
                          style={{ margin: 0, marginBottom: 4 }}
                        >
                          {activity.description}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {activity.timestamp}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Access Section */}
      <Card
        title={
          <Space>
            <TrophyOutlined style={{ color: "#fa541c" }} />
            <Text strong>Truy cập nhanh</Text>
          </Space>
        }
        hoverable
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              className="quick-access-card"
              onClick={() => navigate("/student-portal/credentials")}
            >
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={64}
                  style={{
                    backgroundColor: "#f6ffed",
                    color: "#52c41a",
                    marginBottom: 16,
                  }}
                >
                  <TrophyOutlined style={{ fontSize: 32 }} />
                </Avatar>
                <Title level={4} style={{ margin: "8px 0" }}>
                  Bằng cấp của tôi
                </Title>
                <Text type="secondary">
                  Xem và quản lý bằng cấp học thuật của bạn
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              className="quick-access-card"
              onClick={() => navigate("/student-portal/credentials")}
            >
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={64}
                  style={{
                    backgroundColor: "#f0f5ff",
                    color: "#722ed1",
                    marginBottom: 16,
                  }}
                >
                  <BookOutlined style={{ fontSize: 32 }} />
                </Avatar>
                <Title level={4} style={{ margin: "8px 0" }}>
                  Bảng điểm
                </Title>
                <Text type="secondary">
                  Bảng điểm học thuật chính thức và điểm số
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              className="quick-access-card"
              onClick={() => navigate("/student-portal/credentials")}
            >
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={64}
                  style={{
                    backgroundColor: "#e6f7ff",
                    color: "#1a94fc",
                    marginBottom: 16,
                  }}
                >
                  <SafetyCertificateOutlined style={{ fontSize: 32 }} />
                </Avatar>
                <Title level={4} style={{ margin: "8px 0" }}>
                  Chứng chỉ
                </Title>
                <Text type="secondary">
                  Chứng chỉ chuyên nghiệp và thành tích
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              className="quick-access-card"
              onClick={() => navigate("/student-portal/share")}
            >
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={64}
                  style={{
                    backgroundColor: "#fff7e6",
                    color: "#fa8c16",
                    marginBottom: 16,
                  }}
                >
                  <ShareAltOutlined style={{ fontSize: 32 }} />
                </Avatar>
                <Title level={4} style={{ margin: "8px 0" }}>
                  Cổng chia sẻ
                </Title>
                <Text type="secondary">Tạo mã QR và liên kết xác thực</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;
