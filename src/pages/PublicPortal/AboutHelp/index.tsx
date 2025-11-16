import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Collapse,
  Tabs,
  Alert,
  Divider,
  List,
  Avatar,
  Tag,
} from "antd";
import {
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  ApiOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./AboutHelp.scss";

const { Title, Text, Paragraph } = Typography;

const AboutHelp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("faq");

  const faqData = [
    {
      key: "what-is-blockchain-verification",
      label: "Xác thực chứng chỉ blockchain là gì?",
      children: (
        <div>
          <Paragraph>
            Xác thực chứng chỉ blockchain là một phương pháp chống giả mạo để
            xác thực chứng chỉ học thuật bằng công nghệ sổ cái phân tán.
            Mỗi chứng chỉ được ghi lại trên blockchain bất biến, đảm bảo tính
            xác thực và ngăn chặn gian lận.
          </Paragraph>
          <Paragraph>
            <strong>Lợi ích:</strong>
            <ul>
              <li>Xác thực tức thì (2-3 giây)</li>
              <li>Hồ sơ chống giả mạo 100%</li>
              <li>Truy cập toàn cầu 24/7</li>
              <li>Loại bỏ chứng chỉ giả</li>
            </ul>
          </Paragraph>
        </div>
      ),
    },
    {
      key: "how-to-verify",
      label: "Làm thế nào để xác thực chứng chỉ?",
      children: (
        <div>
          <Paragraph>Chúng tôi cung cấp ba phương thức xác thực tiện lợi:</Paragraph>
          <div style={{ marginLeft: 16 }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Tag color="green">Quét mã QR</Tag>
                <Text>
                  Sử dụng camera để quét mã QR từ chứng chỉ
                </Text>
              </div>
              <div>
                <Tag color="blue">Nhập thủ công</Tag>
                <Text>Nhập ID chứng chỉ hoặc mã hash blockchain thủ công</Text>
              </div>
              <div>
                <Tag color="purple">Tải lên file</Tag>
                <Text>
                  Tải lên bản sao kỹ thuật số của chứng chỉ để phân tích
                </Text>
              </div>
            </Space>
          </div>
          <Paragraph style={{ marginTop: 16 }}>
            Chỉ cần vào trang <strong>Xác thực chứng chỉ</strong> của chúng tôi và chọn
            phương thức ưa thích của bạn. Kết quả thường có sẵn trong vài giây.
          </Paragraph>
        </div>
      ),
    },
    {
      key: "supported-institutions",
      label: "Những tổ chức nào được hỗ trợ?",
      children: (
        <div>
          <Paragraph>
            Hiện tại chúng tôi hỗ trợ chứng chỉ từ hơn{" "}
            <strong>127 tổ chức</strong> trên toàn thế giới, bao gồm:
          </Paragraph>
          <Row gutter={[16, 8]}>
            <Col xs={24} md={12}>
              <Title level={5}>🇻🇳 Các trường đại học Việt Nam:</Title>
              <ul>
                <li>FPT University</li>
                <li>Vietnam National University (VNU)</li>
                <li>RMIT Vietnam</li>
                <li>University of Economics Ho Chi Minh City (UEH)</li>
                <li>Hanoi University of Science and Technology</li>
              </ul>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>🌍 Đối tác quốc tế:</Title>
              <ul>
                <li>Amazon Web Services (Chứng chỉ)</li>
                <li>Google (Chứng chỉ chuyên nghiệp)</li>
                <li>Microsoft (Chứng chỉ Azure)</li>
                <li>Coursera (Bằng cấp trực tuyến)</li>
                <li>edX (MicroMasters)</li>
              </ul>
            </Col>
          </Row>
          <Alert
            message="Không thấy tổ chức của bạn?"
            description="Liên hệ với chúng tôi để thảo luận về việc thêm tổ chức của bạn vào mạng xác thực của chúng tôi."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      ),
    },
    {
      key: "verification-failed",
      label: "Nếu xác thực thất bại thì sao?",
      children: (
        <div>
          <Paragraph>
            Nếu xác thực chứng chỉ thất bại, có thể do một số lý do sau:
          </Paragraph>
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                title: "Không tìm thấy chứng chỉ",
                description:
                  "ID chứng chỉ hoặc mã hash blockchain không tồn tại trong hồ sơ của chúng tôi",
              },
              {
                title: "Định dạng không hợp lệ",
                description:
                  "Định dạng ID chứng chỉ không đúng hoặc có lỗi chính tả",
              },
              {
                title: "Chứng chỉ đã bị thu hồi",
                description:
                  "Tổ chức đã thu hồi hoặc hủy chứng chỉ này",
              },
              {
                title: "Tổ chức không được hỗ trợ",
                description:
                  "Tổ chức cấp chứng chỉ không thuộc mạng xác thực của chúng tôi",
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<CloseCircleOutlined />}
                      style={{ backgroundColor: "#ff4d4f" }}
                    />
                  }
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
          <Alert
            message="Bước tiếp theo"
            description="Nếu xác thực thất bại, vui lòng kiểm tra lại ID chứng chỉ và liên hệ với tổ chức cấp để được hỗ trợ."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      ),
    },
    {
      key: "data-privacy",
      label: "Dữ liệu của tôi được bảo vệ như thế nào?",
      children: (
        <div>
          <Paragraph>
            Chúng tôi coi trọng quyền riêng tư dữ liệu và tuân theo các thực hành tốt nhất trong ngành:
          </Paragraph>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              <Text strong>Không lưu trữ dữ liệu cá nhân:</Text> Chúng tôi không lưu trữ
              thông tin cá nhân từ các lần xác thực
            </div>
            <div>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              <Text strong>Kết nối được mã hóa:</Text> Tất cả việc truyền dữ liệu
              sử dụng mã hóa SSL/TLS
            </div>
            <div>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              <Text strong>Xác thực ẩn danh:</Text> Có thể thực hiện xác thực
              mà không cần tạo tài khoản
            </div>
            <div>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              <Text strong>Tuân thủ GDPR:</Text> Chúng tôi tuân thủ các quy định
              bảo vệ dữ liệu quốc tế
            </div>
          </Space>
        </div>
      ),
    },
  ];

  const contactInfo = [
    {
      icon: <PhoneOutlined style={{ color: "#1890ff" }} />,
      title: "Hỗ trợ qua điện thoại",
      description: "+84 (0) 123 456 789",
      subtitle: "Thứ Hai - Thứ Sáu, 9:00 - 18:00 (GMT+7)",
    },
    {
      icon: <MailOutlined style={{ color: "#52c41a" }} />,
      title: "Hỗ trợ qua email",
      description: "support@credentialverifier.com",
      subtitle: "Phản hồi trong vòng 24 giờ",
    },
    {
      icon: <GlobalOutlined style={{ color: "#722ed1" }} />,
      title: "Trò chuyện trực tiếp",
      description: "Có sẵn trên trang web của chúng tôi",
      subtitle: "Thứ Hai - Thứ Sáu, 9:00 - 18:00 (GMT+7)",
    },
    {
      icon: <TeamOutlined style={{ color: "#fa541c" }} />,
      title: "Hỗ trợ doanh nghiệp",
      description: "enterprise@credentialverifier.com",
      subtitle: "Hỗ trợ chuyên dụng cho các tổ chức lớn",
    },
  ];

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/v1/verify",
      description: "Xác thực chứng chỉ theo ID hoặc hash",
      parameters: "credential_id, verification_method",
    },
    {
      method: "GET",
      endpoint: "/api/v1/institutions",
      description: "Lấy danh sách các tổ chức được hỗ trợ",
      parameters: "page, limit, search",
    },
    {
      method: "GET",
      endpoint: "/api/v1/status/{credential_id}",
      description: "Lấy trạng thái và chi tiết chứng chỉ",
      parameters: "credential_id",
    },
    {
      method: "POST",
      endpoint: "/api/v1/batch-verify",
      description: "Xác thực nhiều chứng chỉ cùng lúc",
      parameters: "credential_ids[]",
    },
  ];

  const tabItems = [
    {
      key: "faq",
      label: (
        <span>
          <QuestionCircleOutlined />
          FAQ
        </span>
      ),
      children: (
        <div className="faq-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3}>Câu hỏi thường gặp</Title>
            <Text type="secondary">
              Tìm câu trả lời cho các câu hỏi phổ biến về dịch vụ xác thực chứng chỉ của chúng tôi
            </Text>
          </div>

          <Collapse
            items={faqData}
            defaultActiveKey={["what-is-blockchain-verification"]}
            ghost
            size="large"
          />
        </div>
      ),
    },
    {
      key: "contact",
      label: (
        <span>
          <PhoneOutlined />
          Liên hệ
        </span>
      ),
      children: (
        <div className="contact-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3}>Liên hệ với chúng tôi</Title>
            <Text type="secondary">
              Cần hỗ trợ? Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ bạn
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {contactInfo.map((contact, index) => (
              <Col xs={24} md={12} key={index}>
                <Card hoverable className="contact-card">
                  <Space>
                    <Avatar size={48} icon={contact.icon} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {contact.title}
                      </Title>
                      <Text strong>{contact.description}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {contact.subtitle}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />

          <Card title="📍 Vị trí văn phòng" style={{ textAlign: "center" }}>
            <Title level={4}>Tòa nhà FPT Software</Title>
            <Paragraph>
              Đường Nam Kỳ Khởi Nghĩa, Phường Nguyễn Du
              <br />
              Quận 1, Thành phố Hồ Chí Minh, Việt Nam
            </Paragraph>
            <Button type="primary" icon={<GlobalOutlined />}>
              Xem trên Google Maps
            </Button>
          </Card>
        </div>
      ),
    },
    {
      key: "api",
      label: (
        <span>
          <ApiOutlined />
          Tài liệu API
        </span>
      ),
      children: (
        <div className="api-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3}>Tài liệu API</Title>
            <Text type="secondary">
              Tích hợp xác thực chứng chỉ vào ứng dụng của bạn
            </Text>
          </div>

          <Alert
            message="Truy cập API"
            description="Truy cập API có sẵn cho khách hàng doanh nghiệp. Liên hệ đội ngũ bán hàng của chúng tôi để bắt đầu."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Card title="🚀 Bắt đầu" style={{ marginBottom: 24 }}>
            <Paragraph>
              RESTful API của chúng tôi cho phép bạn tích hợp xác thực chứng chỉ
              trực tiếp vào ứng dụng của bạn. Tất cả các endpoint trả về phản hồi JSON
              và sử dụng mã trạng thái HTTP tiêu chuẩn.
            </Paragraph>
            <Paragraph>
              <Text strong>URL cơ sở:</Text>{" "}
              <Text code>https://api.credentialverifier.com</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Xác thực:</Text> Bearer token (được cung cấp khi
              đăng ký)
            </Paragraph>
          </Card>

          <Card title=" Các endpoint API">
            <List
              itemLayout="vertical"
              dataSource={apiEndpoints}
              renderItem={(item) => (
                <List.Item>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Space>
                      <Tag color={item.method === "GET" ? "blue" : "green"}>
                        {item.method}
                      </Tag>
                      <Text code>{item.endpoint}</Text>
                    </Space>
                    <Text>{item.description}</Text>
                    <Text type="secondary">Tham số: {item.parameters}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card title="💻 Ví dụ yêu cầu" style={{ marginTop: 24 }}>
            <pre
              style={{ background: "#f5f5f5", padding: 16, borderRadius: 8 }}
            >
              {`curl -X POST https://api.credentialverifier.com/api/v1/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "credential_id": "deg_001",
    "verification_method": "api"
  }'`}
            </pre>
          </Card>
        </div>
      ),
    },
    {
      key: "about",
      label: (
        <span>
          <BookOutlined />
          Về chúng tôi
        </span>
      ),
      children: (
        <div className="about-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3}>Về nền tảng của chúng tôi</Title>
            <Text type="secondary">
              Dẫn đầu tương lai của xác thực chứng chỉ với công nghệ blockchain
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <SafetyCertificateOutlined
                  style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }}
                />
                <Title level={4}>An toàn & Đáng tin cậy</Title>
                <Paragraph>
                  Được xây dựng trên công nghệ blockchain đảm bảo xác thực chống giả mạo
                  và loại bỏ gian lận chứng chỉ.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <RocketOutlined
                  style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }}
                />
                <Title level={4}>Nhanh & Đáng tin cậy</Title>
                <Paragraph>
                  Nhận kết quả xác thực trong vài giây với thời gian hoạt động 99.9% và
                  khả năng truy cập toàn cầu.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <GlobalOutlined
                  style={{ fontSize: 48, color: "#722ed1", marginBottom: 16 }}
                />
                <Title level={4}>Mạng lưới toàn cầu</Title>
                <Paragraph>
                  Đối tác với hơn 127 tổ chức trên toàn thế giới, được tin tưởng bởi hơn 500+
                  tổ chức.
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Card>
            <Title level={4}>🎯 Sứ mệnh của chúng tôi</Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              Cách mạng hóa xác thực chứng chỉ bằng cách cung cấp xác nhận tức thì,
              an toàn và có thể truy cập toàn cầu cho các thành tựu học thuật.
              Chúng tôi tin vào việc tạo ra một thế giới nơi chứng chỉ xác thực
              có thể được xác thực ở bất cứ đâu, bất cứ lúc nào, loại bỏ gian lận
              và xây dựng niềm tin trong giáo dục.
            </Paragraph>

            <Title level={4} style={{ marginTop: 32 }}>
              📊 Thống kê nền tảng
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: "center" }}>
                  <Title level={2} style={{ color: "#722ed1", margin: 0 }}>
                    152K+
                  </Title>
                  <Text type="secondary">Chứng chỉ đã xác thực</Text>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: "center" }}>
                  <Title level={2} style={{ color: "#722ed1", margin: 0 }}>
                    127
                  </Title>
                  <Text type="secondary">Tổ chức đối tác</Text>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: "center" }}>
                  <Title level={2} style={{ color: "#722ed1", margin: 0 }}>
                    500+
                  </Title>
                  <Text type="secondary">Tổ chức tin cậy</Text>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: "center" }}>
                  <Title level={2} style={{ color: "#722ed1", margin: 0 }}>
                    2.3s
                  </Title>
                  <Text type="secondary">Thời gian phản hồi trung bình</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="about-help">
      {/* Page Header */}
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: "#ffffff" }}>
          Trung tâm trợ giúp & Hỗ trợ
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Tất cả những gì bạn cần biết về xác thực chứng chỉ
        </Text>
      </div>

      {/* Main Content */}
      <Card className="help-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          size="large"
          items={tabItems}
          className="help-tabs"
        />
      </Card>
    </div>
  );
};

export default AboutHelp;
