import React, { useState, useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
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
  const [otpValues, setOtpValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const [emailForm] = Form.useForm<EmailForm>();
  const [resetPasswordForm] = Form.useForm<ResetPasswordForm>();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Update form value
    const otpCode = newOtpValues.join("");
    resetPasswordForm.setFieldsValue({ otpCode });

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }

    // Auto proceed to next step when all 6 digits are entered
    if (otpCode.length === 6) {
      setTimeout(() => {
        setCurrentStep(2);
      }, 300);
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtpValues = pastedData.split("").slice(0, 6);
    while (newOtpValues.length < 6) newOtpValues.push("");
    setOtpValues(newOtpValues);
    resetPasswordForm.setFieldsValue({ otpCode: pastedData });

    // Auto proceed to next step if 6 digits pasted
    if (pastedData.length === 6) {
      setTimeout(() => {
        setCurrentStep(2);
      }, 300);
    } else {
      // Focus last input
      const lastIndex = Math.min(pastedData.length - 1, 5);
      const lastInput = document.getElementById(`otp-input-${lastIndex}`);
      lastInput?.focus();
    }
  };

  // Handle OTP key down
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

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
      setCountdown(60);
      toast.success("Mã xác thực đã được gửi đến email của bạn!");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gửi mã xác thực thất bại. Vui lòng thử lại!";
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
      toast.success("Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đặt lại mật khẩu thất bại. Vui lòng kiểm tra mã và thử lại!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isLoading) return;
    setIsLoading(true);
    try {
      await AuthServices.sendOtp({
        email: email,
        purpose: "PasswordReset",
      });
      setCountdown(60);
      setOtpValues(["", "", "", "", "", ""]);
      resetPasswordForm.setFieldsValue({ otpCode: "" });
      // Reset focus to first input
      const firstInput = document.getElementById("otp-input-0");
      firstInput?.focus();
      toast.success("Mã xác thực đã được gửi lại!");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gửi lại mã thất bại. Vui lòng thử lại!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-left">
        <div className="forgot-password-form-wrapper">
          {/* Step 1: Email Input */}
          {currentStep === 0 && (
            <>
              <div className="forgot-password-icon">
                <div className="icon-wrapper">
                  <LockOutlined />
                </div>
              </div>
              <Title level={1} className="forgot-password-title">
                Quên mật khẩu?
              </Title>
              <Text className="forgot-password-subtitle">
                Đừng lo, chúng tôi sẽ gửi hướng dẫn đặt lại cho bạn.
              </Text>

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
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Vui lòng nhập email hợp lệ!" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    placeholder="Nhập email của bạn"
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
                    Đặt lại mật khẩu
                  </Button>
                </Form.Item>

                <div className="forgot-password-links">
                  <Link to="/login" className="back-to-login">
                    ← Quay lại đăng nhập
                  </Link>
                </div>
              </Form>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 1 && (
            <>
              <div className="forgot-password-icon">
                <div className="icon-wrapper">
                  <MailOutlined />
                </div>
              </div>
              <Title level={1} className="forgot-password-title">
                Đặt lại mật khẩu
              </Title>
              <Text className="forgot-password-subtitle">
                Chúng tôi đã gửi mã đến <strong>{email}</strong>
              </Text>

              <div className="otp-input-wrapper">
                <div className="otp-input-container">
                  {otpValues.map((value, index) => (
                    <Input
                      key={index}
                      id={`otp-input-${index}`}
                      className="otp-input"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onPaste={handleOtpPaste}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={isLoading}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <Form
                layout="vertical"
                size="large"
                className="forgot-password-form"
              >
                <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
                  <Button
                    type="primary"
                    block
                    loading={isLoading}
                    className="forgot-password-button"
                    onClick={() => {
                      const otpCode = otpValues.join("");
                      if (otpCode.length === 6) {
                        setCurrentStep(2);
                      } else {
                        toast.error("Vui lòng nhập đầy đủ mã 6 chữ số");
                      }
                    }}
                  >
                    Tiếp tục
                  </Button>
                </Form.Item>
              </Form>

              <div className="forgot-password-links">
                <div className="resend-code-section">
                  {countdown > 0 ? (
                    <Text className="resend-countdown">
                      Không nhận được email?{" "}
                      <span className="countdown-number">{countdown}s</span>
                    </Text>
                  ) : (
                    <Text className="resend-text">
                      Không nhận được email?
                      <Button
                        type="link"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="resend-link"
                      >
                        Nhấn để gửi lại
                      </Button>
                    </Text>
                  )}
                </div>
                <Link
                  to="/login"
                  className="back-to-login"
                  style={{
                    color: "#6b7280",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  ← Quay lại đăng nhập
                </Link>
              </div>
            </>
          )}

          {/* Step 3: Set New Password */}
          {currentStep === 2 && (
            <>
              <div className="forgot-password-icon">
                <div className="icon-wrapper">
                  <LockOutlined />
                </div>
              </div>
              <Title level={1} className="forgot-password-title">
                Đặt mật khẩu mới
              </Title>
              <Text className="forgot-password-subtitle">
                Phải có ít nhất 8 ký tự
              </Text>

              <Form
                form={resetPasswordForm}
                onFinish={(values) => {
                  const otpCode = otpValues.join("");
                  handleResetPassword({ ...values, otpCode });
                }}
                layout="vertical"
                size="large"
                className="forgot-password-form"
              >
                <Form.Item
                  label="Mật khẩu"
                  name="newPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                    {
                      min: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Nhập mật khẩu mới"
                    disabled={isLoading}
                    onChange={(e) => {
                      setPasswordStrength(
                        calculatePasswordStrength(e.target.value)
                      );
                      resetPasswordForm.setFieldsValue({
                        newPassword: e.target.value,
                      });
                    }}
                  />
                </Form.Item>

                {/* Password Strength Indicator */}
                <div className="password-strength">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`strength-bar ${
                        index < passwordStrength ? "active" : ""
                      }`}
                    />
                  ))}
                </div>

                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Nhập lại mật khẩu mới"
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
                    Đặt lại mật khẩu
                  </Button>
                </Form.Item>

                <div className="forgot-password-links">
                  <Link to="/login" className="back-to-login">
                    ← Quay lại đăng nhập
                  </Link>
                </div>
              </Form>
            </>
          )}

          {/* Step Indicator */}
          <div className="step-indicator">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`step-dot ${index <= currentStep ? "active" : ""} ${
                  index < currentStep ? "completed" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="forgot-password-right">
        <div className="fap-logo">
          UAP
          <br />
          Blockchain
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
