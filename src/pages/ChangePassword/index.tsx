import React, { useState } from "react";
import { Button, Form, Input, Typography, Card, Alert, Steps } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthServices from "../../services/auth/api.service";
import { logout } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearAllCookies } from "../../utils/cookie";
import type { RootState } from "../../redux/store";
import "./index.scss";

const { Title, Text } = Typography;

interface SendOtpForm {
  // No fields needed, we'll use user's email from Redux
}

interface ChangePasswordForm {
  otpCode: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [otpForm] = Form.useForm<SendOtpForm>();
  const [passwordForm] = Form.useForm<ChangePasswordForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProfile = useSelector((state: RootState) => state.auth.userProfile);

  // Countdown timer for resend OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!userProfile?.email) {
      toast.error("User email not found. Please login again.");
      return;
    }

    setIsLoading(true);
    try {
      await AuthServices.sendOtp({
        email: userProfile.email,
        purpose: "PasswordReset",
      });
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

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || !userProfile?.email) return;
    setIsLoading(true);
    try {
      await AuthServices.sendOtp({
        email: userProfile.email,
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    if (password.length === 0) {
      setPasswordStrength(null);
      return;
    }
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "#ff4d4f";
      case "medium":
        return "#faad14";
      case "strong":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  // Step 2: Change Password with OTP
  const onFinish = async (values: ChangePasswordForm) => {
    setIsLoading(true);
    try {
      const response = await AuthServices.changePasswordWithOtp({
        otpCode: values.otpCode,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully! Please login again.");

        // Logout user after password change
        dispatch(logout());
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        clearAllCookies();

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to change password!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password! Please check your OTP and information.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      title: "Send OTP",
      icon: <MailOutlined />,
    },
    {
      title: "Change Password",
      icon: <LockOutlined />,
    },
  ];

  return (
    <div className="change-password-container">
      <Card className="change-password-card">
        <div className="change-password-header">
          <Title level={2}>Change Password</Title>
          <Text type="secondary">
            Please follow the steps to change your password
          </Text>
        </div>

        <Alert
          message="Note"
          description="After successfully changing your password, you will be logged out and need to login again with your new password."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Steps
          current={currentStep}
          items={steps}
          className="change-password-steps"
          style={{ marginBottom: 32 }}
        />

        {/* Step 1: Send OTP */}
        {currentStep === 0 && (
          <div>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <Text>
                We will send an OTP code to <strong>{userProfile?.email}</strong>
              </Text>
            </div>
            <Button
              type="primary"
              onClick={handleSendOtp}
              block
              loading={isLoading}
              size="large"
              className="change-password-button"
            >
              Send OTP Code
            </Button>
          </div>
        )}

        {/* Step 2: Change Password with OTP */}
        {currentStep === 1 && (
          <Form
            form={passwordForm}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="change-password-form"
          >
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <Text>
                OTP code has been sent to <strong>{userProfile?.email}</strong>
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
              />
            </Form.Item>

            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                { required: true, message: "Please enter current password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter current password"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter new password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
                disabled={isLoading}
                onChange={handlePasswordChange}
              />
            </Form.Item>

            {passwordStrength && (
              <div className="password-strength-indicator">
                <div
                  className="password-strength-bar"
                  style={{
                    width:
                      passwordStrength === "weak"
                        ? "33%"
                        : passwordStrength === "medium"
                        ? "66%"
                        : "100%",
                    backgroundColor: getPasswordStrengthColor(),
                  }}
                />
                <Text
                  type="secondary"
                  style={{ color: getPasswordStrengthColor(), fontSize: 12 }}
                >
                  Strength: {getPasswordStrengthText()}
                </Text>
              </div>
            )}

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm new password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
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
                className="change-password-button"
              >
                Change Password
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button
                type="link"
                onClick={handleResendOtp}
                disabled={countdown > 0 || isLoading}
              >
                {countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Resend OTP Code"}
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ChangePassword;
