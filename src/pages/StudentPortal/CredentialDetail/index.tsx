import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  message,
  Modal,
  QRCode,
  Row,
  Space,
  Statistic,
  Tag,
  Timeline,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  EyeOutlined,
  QrcodeOutlined,
  SafetyCertificateOutlined,
  ShareAltOutlined,
  BookOutlined,
  TrophyOutlined,
  FileTextOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./CredentialDetail.scss";

const { Title, Text, Paragraph } = Typography;

interface CredentialDetailData {
  id: string;
  type: "degree" | "transcript" | "certificate";
  title: string;
  institution: string;
  issueDate: string;
  status: "active" | "pending" | "revoked";
  gpa?: string;
  major?: string;
  achievements?: string[];
  blockchainHash?: string;
  transactionHash?: string;
  blockNumber?: number;
  verificationCount: number;
  description?: string;
  validUntil?: string;
  issuer: {
    name: string;
    department?: string;
    contact?: string;
  };
  verification: {
    method: string;
    algorithm: string;
    timestamp: string;
  };
}

const CredentialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  // Mock data based on credential ID
  const getCredentialData = (
    credentialId: string
  ): CredentialDetailData | null => {
    const mockData: Record<string, CredentialDetailData> = {
      deg_001: {
        id: "deg_001",
        type: "degree",
        title: "Bachelor of Software Engineering",
        institution: "FPT University",
        issueDate: "2024-06-15",
        status: "active",
        gpa: "3.85",
        major: "Software Engineering",
        achievements: [
          "Magna Cum Laude",
          "Dean's List - 6 semesters",
          "Outstanding Student Award 2024",
          "Best Capstone Project",
        ],
        blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
        blockNumber: 18567234,
        verificationCount: 15,
        description:
          "Four-year undergraduate program specializing in software development, algorithms, and system design.",
        validUntil: "2029-06-15",
        issuer: {
          name: "FPT University",
          department: "School of Engineering",
          contact: "registrar@fpt.edu.vn",
        },
        verification: {
          method: "Digital Signature",
          algorithm: "RSA-256",
          timestamp: "2024-06-15T10:30:00Z",
        },
      },
      cert_001: {
        id: "cert_001",
        type: "certificate",
        title: "AWS Cloud Practitioner",
        institution: "Amazon Web Services",
        issueDate: "2024-03-22",
        status: "active",
        achievements: ["Score: 880/1000", "Certification Level: Foundational"],
        blockchainHash: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
        transactionHash: "0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b",
        blockNumber: 18234567,
        verificationCount: 8,
        description:
          "Cloud computing fundamentals certification covering AWS core services, pricing, and security.",
        validUntil: "2027-03-22",
        issuer: {
          name: "Amazon Web Services",
          department: "Training and Certification",
          contact: "aws-certification@amazon.com",
        },
        verification: {
          method: "Digital Certificate",
          algorithm: "SHA-256",
          timestamp: "2024-03-22T14:45:00Z",
        },
      },
      trans_001: {
        id: "trans_001",
        type: "transcript",
        title: "Academic Transcript - Fall 2023",
        institution: "FPT University",
        issueDate: "2024-01-10",
        status: "active",
        gpa: "3.75",
        major: "Software Engineering",
        blockchainHash: "0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b",
        transactionHash: "0x1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d",
        blockNumber: 17890123,
        verificationCount: 12,
        description:
          "Official academic transcript for Fall 2023 semester including all courses and grades.",
        issuer: {
          name: "FPT University",
          department: "Registrar Office",
          contact: "transcript@fpt.edu.vn",
        },
        verification: {
          method: "Institutional Seal",
          algorithm: "ECDSA",
          timestamp: "2024-01-10T09:15:00Z",
        },
      },
    };

    return mockData[credentialId || ""] || null;
  };

  const credentialData = getCredentialData(id || "");

  if (!credentialData) {
    return (
      <div className="credential-detail">
        <Card>
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <Title level={3}>Không tìm thấy chứng chỉ</Title>
            <Text type="secondary">
              Chứng chỉ được yêu cầu không thể tìm thấy.
            </Text>
            <br />
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/student-portal/credentials")}
              style={{ marginTop: 16 }}
            >
              Quay lại chứng chỉ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case "degree":
        return <TrophyOutlined style={{ color: "#52c41a", fontSize: 32 }} />;
      case "certificate":
        return (
          <SafetyCertificateOutlined
            style={{ color: "#1890ff", fontSize: 32 }}
          />
        );
      case "transcript":
        return <BookOutlined style={{ color: "#722ed1", fontSize: 32 }} />;
      default:
        return <FileTextOutlined style={{ color: "#8c8c8c", fontSize: 32 }} />;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Hoạt động
          </Tag>
        );
      case "pending":
        return (
          <Tag color="warning" icon={<ClockCircleOutlined />}>
            Đang chờ
          </Tag>
        );
      case "revoked":
        return <Tag color="error">Đã thu hồi</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const verificationUrl = `${window.location.origin}/public-portal?verify=${credentialData.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    message.success("Đã sao chép liên kết xác thực vào clipboard!");
  };

  const handleDownloadPDF = () => {
    message.success("Đã bắt đầu tải xuống PDF!");
  };

  const handleDownloadImage = () => {
    message.success("Đã bắt đầu tải xuống hình ảnh!");
  };

  const handleShare = (platform: string) => {
    message.success(`Đã chia sẻ lên ${platform}!`);
    setShareModalVisible(false);
  };

  return (
    <div className="credential-detail">
      {/* Header */}
      <div className="detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/student-portal/credentials")}
          style={{ marginBottom: 16 }}
        >
          Quay lại chứng chỉ
        </Button>

        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Space>
              <Avatar size={64} icon={getCredentialIcon(credentialData.type)} />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {credentialData.title}
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {credentialData.institution}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<ShareAltOutlined />}
                onClick={() => setShareModalVisible(true)}
              >
                Chia sẻ
              </Button>
              <Button
                icon={<QrcodeOutlined />}
                onClick={() => setQrModalVisible(true)}
              >
                Mã QR
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
                Tải xuống
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        {/* Main Information */}
        <Col xs={24} lg={16}>
          <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Loại chứng chỉ">
                <Tag
                  color={
                    credentialData.type === "degree"
                      ? "green"
                      : credentialData.type === "certificate"
                      ? "blue"
                      : "purple"
                  }
                >
                  {credentialData.type === "degree"
                    ? "Bằng cấp"
                    : credentialData.type === "certificate"
                    ? "Chứng chỉ"
                    : "Bảng điểm"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(credentialData.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cấp">
                <Space>
                  <CalendarOutlined />
                  {dayjs(credentialData.issueDate).format("DD/MM/YYYY")}
                </Space>
              </Descriptions.Item>
              {credentialData.validUntil && (
                <Descriptions.Item label="Có hiệu lực đến">
                  <Space>
                    <CalendarOutlined />
                    {dayjs(credentialData.validUntil).format("DD/MM/YYYY")}
                  </Space>
                </Descriptions.Item>
              )}
              {credentialData.gpa && (
                <Descriptions.Item label="GPA">
                  <Tag color="gold">{credentialData.gpa}</Tag>
                </Descriptions.Item>
              )}
              {credentialData.major && (
                <Descriptions.Item label="Chuyên ngành">
                  {credentialData.major}
                </Descriptions.Item>
              )}
            </Descriptions>

            {credentialData.description && (
              <>
                <Divider />
                <Title level={5}>Mô tả</Title>
                <Paragraph>{credentialData.description}</Paragraph>
              </>
            )}

            {credentialData.achievements &&
              credentialData.achievements.length > 0 && (
                <>
                  <Divider />
                  <Title level={5}>Thành tích & Danh hiệu</Title>
                  <Timeline
                    items={credentialData.achievements.map((achievement) => ({
                      dot: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                      children: achievement,
                    }))}
                  />
                </>
              )}
          </Card>

          {/* Issuer Information */}
          <Card title="Thông tin người cấp">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tổ chức">
                {credentialData.issuer.name}
              </Descriptions.Item>
              {credentialData.issuer.department && (
                <Descriptions.Item label="Khoa/Bộ phận">
                  {credentialData.issuer.department}
                </Descriptions.Item>
              )}
              {credentialData.issuer.contact && (
                <Descriptions.Item label="Liên hệ">
                  {credentialData.issuer.contact}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Verification Stats */}
          <Card style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Lần xác thực"
                  value={credentialData.verificationCount}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Bảo mật"
                  value="100"
                  prefix={<SafetyCertificateOutlined />}
                  suffix="%"
                />
              </Col>
            </Row>
          </Card>

          {/* Blockchain Information */}
          <Card title="Xác thực Blockchain" style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>Mã hash Blockchain:</Text>
                <br />
                <Text code copyable style={{ fontSize: 11 }}>
                  {credentialData.blockchainHash}
                </Text>
              </div>

              <div>
                <Text strong>Giao dịch:</Text>
                <br />
                <Text code copyable style={{ fontSize: 11 }}>
                  {credentialData.transactionHash}
                </Text>
              </div>

              <div>
                <Text strong>Số khối:</Text>
                <br />
                <Text>{credentialData.blockNumber?.toLocaleString()}</Text>
              </div>

              <Divider />

              <div>
                <Text strong>Phương thức xác thực:</Text>
                <br />
                <Text>{credentialData.verification.method}</Text>
              </div>

              <div>
                <Text strong>Thuật toán:</Text>
                <br />
                <Text>{credentialData.verification.algorithm}</Text>
              </div>

              <div>
                <Text strong>Xác thực lúc:</Text>
                <br />
                <Text>
                  {dayjs(credentialData.verification.timestamp).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </Text>
              </div>
            </Space>
          </Card>

          {/* Quick Actions */}
          <Card title="Thao tác nhanh">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button block icon={<LinkOutlined />} onClick={handleCopyLink}>
                Sao chép liên kết xác thực
              </Button>
              <Button
                block
                icon={<DownloadOutlined />}
                onClick={handleDownloadImage}
              >
                Tải xuống dưới dạng hình ảnh
              </Button>
              <Button
                block
                icon={<ShareAltOutlined />}
                onClick={() => setShareModalVisible(true)}
              >
                Chia sẻ chứng chỉ
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* QR Code Modal */}
      <Modal
        title="Mã QR để xác thực"
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQrModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="download"
            type="primary"
            onClick={() => message.success("Đã tải xuống mã QR!")}
          >
            Tải xuống mã QR
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <QRCode value={verificationUrl} size={200} />
          <br />
          <br />
          <Text type="secondary">
            Quét mã QR này để xác thực chứng chỉ
          </Text>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        title="Chia sẻ chứng chỉ"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
      >
        <div style={{ padding: "20px 0" }}>
          <Text strong>Liên kết xác thực:</Text>
          <div
            style={{
              background: "#f5f5f5",
              padding: "12px",
              borderRadius: "6px",
              marginTop: "8px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Text code style={{ flex: 1, margin: 0, fontSize: "12px" }}>
              {verificationUrl}
            </Text>
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopyLink}
            >
              Sao chép
            </Button>
          </div>

          <Divider />

          <Title level={5}>Chia sẻ đến:</Title>
          <Space wrap>
            <Button onClick={() => handleShare("Email")}>📧 Email</Button>
            <Button onClick={() => handleShare("LinkedIn")}>💼 LinkedIn</Button>
            <Button onClick={() => handleShare("Twitter")}>🐦 Twitter</Button>
            <Button onClick={() => handleShare("Facebook")}>
              📘 Facebook
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default CredentialDetail;
