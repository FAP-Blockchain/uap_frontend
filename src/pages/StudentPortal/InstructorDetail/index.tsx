import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Descriptions,
  Button,
  Space,
  Typography,
  Avatar,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import "./InstructorDetail.scss";

const { Title, Text } = Typography;

interface InstructorDetailData {
  code: string;
  login: string;
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  image?: string;
  bio?: string;
  courses?: string[];
  experience?: string;
}

const InstructorDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock instructor data
  const getInstructorData = (
    instructorCode: string
  ): InstructorDetailData | null => {
    const mockData: Record<string, InstructorDetailData> = {
      DuyNK32: {
        code: "DuyNK32",
        login: "duynk32",
        fullName: "Dr. Nguyễn Khánh Duy",
        email: "DuyNK33@fe.edu.vn",
        phone: "+84 123 456 789",
        department: "Political Education Department",
        position: "Senior Lecturer",
        image: "", // Empty like in the original image
        bio: "Dr. Duy has over 15 years of experience in political education and Ho Chi Minh ideology research.",
        courses: [
          "HCM202 - Ho Chi Minh Ideology",
          "MLN131 - Marxist-Leninist Philosophy",
        ],
        experience: "15 years",
      },
      TranTB: {
        code: "TranTB",
        login: "trantb",
        fullName: "Prof. Trần Thị Bình",
        email: "TranTB@fe.edu.vn",
        phone: "+84 987 654 321",
        department: "Philosophy Department",
        position: "Professor",
        image: "",
        bio: "Prof. Tran specializes in Marxist-Leninist philosophy with focus on dialectical materialism.",
        courses: [
          "MLN131 - Marxist-Leninist Philosophy",
          "PHI101 - Introduction to Philosophy",
        ],
        experience: "20 years",
      },
      LeVC: {
        code: "LeVC",
        login: "levc",
        fullName: "Mr. Lê Văn Cường",
        email: "LeVC@fe.edu.vn",
        phone: "+84 456 789 123",
        department: "Software Engineering Department",
        position: "Project Supervisor",
        image: "",
        bio: "Mr. Le is an experienced software engineer and project manager with industry background.",
        courses: [
          "SEP490 - Capstone Project",
          "SWP391 - Software Development Project",
        ],
        experience: "12 years",
      },
    };

    return mockData[instructorCode] || null;
  };

  const instructorData = getInstructorData(code || "");
  const fromActivity = location.state?.fromActivity || false;

  if (!instructorData) {
    return (
      <div className="instructor-detail">
        <Card>
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <Title level={3}>Instructor Not Found</Title>
            <Text type="secondary">
              The requested instructor could not be found.
            </Text>
            <br />
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ marginTop: 16 }}
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleBackClick = () => {
    if (fromActivity) {
      navigate(-1); // Go back to activity detail
    } else {
      navigate("/student-portal/timetable");
    }
  };

  return (
    <div className="instructor-detail">
      {/* Header */}
      <div className="detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          style={{ marginBottom: 16 }}
        >
          {fromActivity ? "Back to Activity" : "Back to Timetable"}
        </Button>

        <Title level={2} style={{ margin: 0, color: "#1a94fc" }}>
          User Detail
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Main Information */}
        <Col xs={24}>
          <Card className="main-info-card">
            <div className="instructor-profile-header">
              <div className="profile-banner">
                <div className="profile-content">
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    src={instructorData.image || undefined}
                    className="profile-avatar"
                  />
                  <div className="profile-info">
                    <Title level={3} className="profile-name">
                      {instructorData.fullName}
                    </Title>
                    <Text className="profile-position">
                      {instructorData.position || "Instructor"}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="instructor-details">
              <Descriptions
                column={1}
                bordered
                layout="horizontal"
                labelStyle={{ width: "200px" }}
              >
                <Descriptions.Item label="Login">
                  <Text strong>{instructorData.login}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Full Name">
                  <Text strong>{instructorData.fullName}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Email">
                  <Space>
                    <MailOutlined style={{ color: "#1a94fc" }} />
                    <Text copyable>{instructorData.email}</Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InstructorDetail;
