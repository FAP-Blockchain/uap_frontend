import React, { useState } from "react";
import { Button, Form, Input, Typography, Steps } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthServices from "../../services/auth/api.service";
import "./index.scss";

const { Title, Text } = Typography;

interface EmailForm {
  email: string;
}

interface ResetPasswordForm {
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const [emailForm] = Form.useForm<EmailForm>();
  const [resetPasswordForm] = Form.useForm<ResetPasswordForm>();

  // Countdown timer for resend OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Send OTP
  const handleSendOtp = async (values: EmailForm) => {
    setIsLoading(true);
    try {
      await AuthServices.sendOtp({
        email: values.email,
        purpose: "PasswordReset",
      });
      setEmail(values.email);
      setCurrentStep(1);
      setCountdown(60); // 60 seconds countdown
      toast.success("OTP has been sent to your email!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send OTP. Please try again!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password with OTP
  const handleResetPassword = async (values: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      await AuthServices.resetPasswordWithOtp({
        email: email,
        otpCode: values.otpCode,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      toast.success("Password reset successfully! Please login again.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password. Please check your OTP and try again!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      await AuthServices.sendOtp({
        email: email,
        purpose: "PasswordReset",
      });
      setCountdown(60);
      toast.success("OTP has been resent!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP. Please try again!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      title: "Enter Email",
      icon: <MailOutlined />,
    },
    {
      title: "Reset Password",
      icon: <LockOutlined />,
    },
  ];

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="forgot-password-header">
          <Title level={2}>Forgot Password</Title>
          <Text type="secondary">
            Please follow the steps to reset your password
          </Text>
        </div>

        <Steps
          current={currentStep}
          items={steps}
          className="forgot-password-steps"
        />

        <div className="forgot-password-form-wrapper">
          {/* Step 1: Email Input */}
          {currentStep === 0 && (
            <Form
              form={emailForm}
              onFinish={handleSendOtp}
              layout="vertical"
              size="large"
              className="forgot-password-form"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                  className="forgot-password-button"
                >
                  Send OTP Code
                </Button>
              </Form.Item>

              <div className="forgot-password-links">
                <Link to="/login">Back to login</Link>
              </div>
            </Form>
          )}

          {/* Step 2: Reset Password with OTP */}
          {currentStep === 1 && (
            <Form
              form={resetPasswordForm}
              onFinish={handleResetPassword}
              layout="vertical"
              size="large"
              className="forgot-password-form"
            >
              <div className="otp-info">
                <Text>
                  We have sent an OTP code to <strong>{email}</strong>
                </Text>
              </div>

              <Form.Item
                label="OTP Code"
                name="otpCode"
                rules={[
                  { required: true, message: "Please enter OTP code!" },
                  {
                    pattern: /^\d+$/,
                    message: "OTP code must contain only numbers!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter OTP code"
                  maxLength={10}
                  disabled={isLoading}
                  className="otp-input"
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter new password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Re-enter new password"
                  disabled={isLoading}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                  className="forgot-password-button"
                >
                  Reset Password
                </Button>
              </Form.Item>

              <div className="forgot-password-links">
                <Button
                  type="link"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isLoading}
                  className="resend-otp-button"
                >
                  {countdown > 0
                    ? `Resend code in ${countdown}s`
                    : "Resend OTP Code"}
                </Button>
                <Link to="/login">Back to login</Link>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
