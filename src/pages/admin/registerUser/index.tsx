import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  Space,
  message,
  Divider,
  Alert,
  Result,
} from "antd";
import { UserAddOutlined, SaveOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useRoleAccess } from "../../../hooks/useRoleAccess";
import AuthServices from "../../../services/auth/api.service";
import type { RegisterUserRequest } from "../../../Types/Auth";
import "./index.scss";

const { Title } = Typography;
const { Option } = Select;

const RegisterUser: React.FC = () => {
  const [form] = Form.useForm<RegisterUserRequest & { roleName: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"Student" | "Teacher" | "">(
    ""
  );
  const navigate = useNavigate();
  const { isAdmin, userProfile } = useRoleAccess();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Check authentication and admin role on mount
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      toast.error("Please login to access this page");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    if (!isAdmin()) {
      toast.error("Only Admin users can register new users");
      setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 2000);
    }
  }, [isAuthenticated, accessToken, isAdmin, navigate]);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as "Student" | "Teacher");
    // Clear role-specific fields when role changes
    form.setFieldsValue({
      studentCode: undefined,
      enrollmentDate: undefined,
      teacherCode: undefined,
      hireDate: undefined,
      specialization: undefined,
      phoneNumber: undefined,
    });
  };

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      const request: RegisterUserRequest = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        roleName: values.roleName as "Student" | "Teacher",
      };

      // Add role-specific fields
      if (values.roleName === "Student") {
        if (values.studentCode) request.studentCode = values.studentCode;
        if (values.enrollmentDate) {
          request.enrollmentDate = dayjs(values.enrollmentDate).toISOString();
        }
      } else if (values.roleName === "Teacher") {
        if (values.teacherCode) request.teacherCode = values.teacherCode;
        if (values.hireDate) {
          request.hireDate = dayjs(values.hireDate).toISOString();
        }
        if (values.specialization)
          request.specialization = values.specialization;
        if (values.phoneNumber) request.phoneNumber = values.phoneNumber;
      }

      const response = await AuthServices.registerUser(request);

      if (response.success) {
        toast.success(`Registration successful! User ID: ${response.userId}`);
        message.success(
          `User ${response.email} has been created successfully!`
        );
        form.resetFields();
        setSelectedRole("");
      } else {
        toast.error(response.message || "Registration failed!");
        if (response.errors && response.errors.length > 0) {
          message.error(response.errors.join(", "));
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to register user. Please try again!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show error if not authenticated
  if (!isAuthenticated || !accessToken) {
    return (
      <div className="register-user-container">
        <Card>
          <Result
            status="403"
            title="Authentication Required"
            subTitle="Please login to access this page"
            extra={
              <Button type="primary" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  // Show error if not admin
  if (!isAdmin()) {
    return (
      <div className="register-user-container">
        <Card>
          <Result
            status="403"
            title="Access Denied"
            subTitle="Only Admin users can register new users"
            extra={
              <Button type="primary" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="register-user-container">
      <Card>
        <div className="register-user-header">
          <Title level={2}>
            <UserAddOutlined /> Register New User
          </Title>
        </div>

        <Alert
          message="Admin Only"
          description={`You are logged in as ${userProfile?.fullName} (${userProfile?.role}). Only Admin users can register new users.`}
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="register-user-form"
        >
          <Form.Item
            label="Role"
            name="roleName"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select
              placeholder="Select role"
              onChange={handleRoleChange}
              disabled={isLoading}
            >
              <Option value="Student">Student</Option>
              <Option value="Teacher">Teacher</Option>
            </Select>
          </Form.Item>

          <Divider>General Information</Divider>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter full name!" }]}
          >
            <Input placeholder="Enter full name" disabled={isLoading} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input placeholder="Enter email" disabled={isLoading} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter password" disabled={isLoading} />
          </Form.Item>

          {selectedRole === "Student" && (
            <>
              <Divider>Student Information</Divider>
              <Form.Item label="Student Code" name="studentCode">
                <Input placeholder="Enter student code" disabled={isLoading} />
              </Form.Item>
              <Form.Item label="Enrollment Date" name="enrollmentDate">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select enrollment date"
                  disabled={isLoading}
                />
              </Form.Item>
            </>
          )}

          {selectedRole === "Teacher" && (
            <>
              <Divider>Teacher Information</Divider>
              <Form.Item label="Teacher Code" name="teacherCode">
                <Input placeholder="Enter teacher code" disabled={isLoading} />
              </Form.Item>
              <Form.Item label="Hire Date" name="hireDate">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select hire date"
                  disabled={isLoading}
                />
              </Form.Item>
              <Form.Item label="Specialization" name="specialization">
                <Input
                  placeholder="Enter specialization"
                  disabled={isLoading}
                />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Invalid phone number!",
                  },
                ]}
              >
                <Input placeholder="Enter phone number" disabled={isLoading} />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isLoading}
              >
                Register
              </Button>
              <Button onClick={() => navigate("/admin/students")}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterUser;
