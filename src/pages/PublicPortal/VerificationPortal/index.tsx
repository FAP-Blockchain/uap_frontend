import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Input,
  Upload,
  Tabs,
  Form,
  message,
  Divider,
  Alert,
  Progress,
} from "antd";
import {
  QrcodeOutlined,
  SearchOutlined,
  FileTextOutlined,
  CameraOutlined,
  UploadOutlined,
  SafetyCertificateOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import "./VerificationPortal.scss";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const VerificationPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("qr");
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [credentialId, setCredentialId] = useState("");
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  // Mock verification process
  const handleVerification = async (method: string, data: any) => {
    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      message.success("Xác thực hoàn tất thành công!");
      // Navigate to results with mock data
      navigate("/public-portal/results", {
        state: {
          verificationData: data,
          method,
          success: true,
        },
      });
    }, 2000);
  };

  // QR Code scanning simulation
  const handleQRScan = () => {
    setIsScanning(true);
    // Simulate camera access and QR scan
    setTimeout(() => {
      setIsScanning(false);
      const mockQRData = {
        id: "deg_001",
        type: "qr",
        scannedAt: new Date().toISOString(),
      };
      handleVerification("qr", mockQRData);
    }, 3000);
  };

  // Manual ID verification
  const handleManualVerification = () => {
    if (!credentialId.trim()) {
      message.error("Vui lòng nhập ID chứng chỉ hợp lệ");
      return;
    }

    const mockManualData = {
      id: credentialId,
      type: "manual",
      enteredAt: new Date().toISOString(),
    };
    handleVerification("manual", mockManualData);
  };

  // File upload verification
  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".pdf,.jpg,.jpeg,.png",
    beforeUpload: (file) => {
      const isValidType = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ].includes(file.type);
      if (!isValidType) {
        message.error("Bạn chỉ có thể tải lên file PDF, JPG hoặc PNG!");
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("File phải nhỏ hơn 10MB!");
        return false;
      }

      setUploadedFile(file);
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      setUploadedFile(null);
    },
  };

  const handleFileVerification = () => {
    if (!uploadedFile) {
      message.error("Vui lòng tải lên file trước");
      return;
    }

    const mockFileData = {
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      type: "file",
      uploadedAt: new Date().toISOString(),
    };
    handleVerification("file", mockFileData);
  };

  const tabItems = [
    {
      key: "qr",
      label: (
        <span>
          <QrcodeOutlined />
          Quét mã QR
        </span>
      ),
      children: (
        <div className="verification-method">
          <div className="method-header">
            <Title
              level={3}
              style={{ textAlign: "center", margin: "0 0 16px" }}
            >
              Quét mã QR
            </Title>
            <Paragraph style={{ textAlign: "center", color: "#8c8c8c" }}>
              Sử dụng camera để quét mã QR từ tài liệu chứng chỉ hoặc màn hình kỹ thuật số
            </Paragraph>
          </div>

          <div className="qr-scanner-container">
            {isScanning ? (
              <div className="scanning-state">
                <div className="camera-preview">
                  <CameraOutlined style={{ fontSize: 80, color: "#722ed1" }} />
                  <Title
                    level={4}
                    style={{ margin: "16px 0", color: "#722ed1" }}
                  >
                    Đang quét mã QR...
                  </Title>
                  <Progress percent={66} status="active" showInfo={false} />
                </div>
              </div>
            ) : (
              <div className="scan-prompt">
                <QrcodeOutlined
                  style={{ fontSize: 120, color: "#d9d9d9", marginBottom: 24 }}
                />
                <Title
                  level={4}
                  style={{ margin: "0 0 16px", color: "#595959" }}
                >
                  Sẵn sàng quét
                </Title>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: 32 }}
                >
                  Đặt mã QR trong khung để bắt đầu xác thực
                </Text>
                <Button
                  type="primary"
                  size="large"
                  icon={<CameraOutlined />}
                  onClick={handleQRScan}
                  loading={isVerifying}
                  style={{
                    background: "linear-gradient(135deg, #1a94fc, #0d73c9)",
                    border: "none",
                  }}
                >
                  Bắt đầu quét camera
                </Button>
              </div>
            )}
          </div>

          <Alert
            message="Thông báo bảo mật"
            description="Quyền truy cập camera chỉ được sử dụng để quét mã QR và không lưu trữ hình ảnh."
            type="info"
            showIcon
            style={{ marginTop: 24 }}
          />
        </div>
      ),
    },
    {
      key: "manual",
      label: (
        <span>
          <SearchOutlined />
          Nhập thủ công
        </span>
      ),
      children: (
        <div className="verification-method">
          <div className="method-header">
            <Title
              level={3}
              style={{ textAlign: "center", margin: "0 0 16px" }}
            >
              Nhập ID chứng chỉ
            </Title>
            <Paragraph style={{ textAlign: "center", color: "#8c8c8c" }}>
              Nhập thủ công ID chứng chỉ hoặc mã hash blockchain để xác thực tính xác thực
            </Paragraph>
          </div>

          <Form layout="vertical" style={{ maxWidth: 600, margin: "0 auto" }}>
            <Form.Item
              label="ID chứng chỉ / Mã hash Blockchain"
              extra="Nhập mã định danh duy nhất được tìm thấy trên tài liệu chứng chỉ"
            >
              <TextArea
                placeholder="deg_001 hoặc 0x1a2b3c4d5e6f7890abcdef..."
                rows={3}
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                style={{ fontSize: 16 }}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "center", marginTop: 32 }}>
              <Button
                type="primary"
                size="large"
                icon={<SearchOutlined />}
                onClick={handleManualVerification}
                loading={isVerifying}
                disabled={!credentialId.trim()}
              >
                Xác thực chứng chỉ
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          <div className="examples-section">
            <Title level={5} style={{ color: "#1990FF" }}>
              Định dạng ví dụ:
            </Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div className="example-item">
                <Text strong>ID chứng chỉ:</Text>
                <Text code>deg_001, cert_002, trans_003</Text>
              </div>
              <div className="example-item">
                <Text strong>Mã hash Blockchain:</Text>
                <Text code>0x1a2b3c4d5e6f7890abcdef...</Text>
              </div>
            </Space>
          </div>
        </div>
      ),
    },
    {
      key: "file",
      label: (
        <span>
          <FileTextOutlined />
          Tải lên file
        </span>
      ),
      children: (
        <div className="verification-method">
          <div className="method-header">
            <Title
              level={3}
              style={{ textAlign: "center", margin: "0 0 16px" }}
            >
              Tải lên file chứng chỉ
            </Title>
            <Paragraph style={{ textAlign: "center", color: "#8c8c8c" }}>
              Tải lên bản sao kỹ thuật số của chứng chỉ để phân tích xác thực
            </Paragraph>
          </div>

          <div
            className="upload-section"
            style={{ maxWidth: 600, margin: "0 auto" }}
          >
            <Upload.Dragger {...uploadProps} className="credential-uploader">
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ color: "#1990FF" }} />
              </p>
              <p className="ant-upload-text">
                Nhấp hoặc kéo file chứng chỉ vào khu vực này để tải lên
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ file PDF, JPG, PNG tối đa 10MB. Đảm bảo chứng chỉ có mã QR hoặc thông tin xác thực.
              </p>
            </Upload.Dragger>

            {uploadedFile && (
              <div className="uploaded-file-info">
                <Alert
                  message="File sẵn sàng để xác thực"
                  description={`${uploadedFile.name} (${(
                    uploadedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB)`}
                  type="success"
                  showIcon
                  style={{ marginTop: 16 }}
                />

                <Button
                  type="primary"
                  size="large"
                  icon={<SafetyCertificateOutlined />}
                  onClick={handleFileVerification}
                  loading={isVerifying}
                  style={{ marginTop: 16, width: "100%" }}
                >
                  Phân tích & Xác thực file
                </Button>
              </div>
            )}
          </div>

          <Alert
            message="Xử lý file"
            description="Hệ thống AI của chúng tôi sẽ trích xuất dữ liệu xác thực từ các file đã tải lên và đối chiếu với hồ sơ blockchain."
            type="info"
            showIcon
            style={{ marginTop: 24 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="verification-portal">
      {/* Page Header */}
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: "#ffffff" }}>
          Cổng xác thực chứng chỉ
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Chọn phương thức ưa thích của bạn để xác thực chứng chỉ học thuật ngay lập tức
        </Text>
      </div>

      {isVerifying && (
        <Alert
          message="Đang xác thực"
          description="Vui lòng đợi trong khi chúng tôi xác thực chứng chỉ với hồ sơ blockchain..."
          type="info"
          showIcon
          icon={<LoadingOutlined />}
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Verification Methods */}
      <Card className="verification-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          size="large"
          items={tabItems}
          className="verification-tabs"
        />
      </Card>

      {/* Help Section */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={8}>
          <Card hoverable className="help-card">
            <QrcodeOutlined
              style={{ fontSize: 32, color: "#52c41a", marginBottom: 16 }}
            />
            <Title level={4}>Phương thức QR Code</Title>
            <Text type="secondary">
              Phương thức nhanh nhất và an toàn nhất. Chỉ cần quét mã QR từ chứng chỉ.
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable className="help-card">
            <SearchOutlined
              style={{ fontSize: 32, color: "#1890ff", marginBottom: 16 }}
            />
            <Title level={4}>Nhập thủ công</Title>
            <Text type="secondary">
              Nhập ID chứng chỉ thủ công khi mã QR không có sẵn.
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable className="help-card">
            <FileTextOutlined
              style={{ fontSize: 32, color: "#722ed1", marginBottom: 16 }}
            />
            <Title level={4}>Phân tích file</Title>
            <Text type="secondary">
              Tải lên file kỹ thuật số để tự động phát hiện và xác thực chứng chỉ.
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VerificationPortal;
