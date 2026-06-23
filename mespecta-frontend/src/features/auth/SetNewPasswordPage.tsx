import { Form, Input, Button, message, Typography, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setNewPassword } from "./auth.api";
import { setMustChangePassword } from "./auth.slice";

const { Title, Text } = Typography;

export default function SetNewPasswordPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onFinish = async (values: { newPassword: string }) => {
    setErrorMsg(null);
    try {
      setSubmitting(true);
      await setNewPassword(values.newPassword);
      dispatch(setMustChangePassword(false));
      message.success("Password set successfully");
      navigate("/");
    } catch (err: any) {
      const text = err?.response?.data?.message || "Failed to set new password.";
      setErrorMsg(text);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#fff",
          borderRadius: 16,
          padding: "40px 40px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <Title level={3} style={{ marginBottom: 4 }}>
          Set a new password
        </Title>
        <Text type="secondary" style={{ display: "block", marginBottom: 28 }}>
          Your administrator reset your password. Please set a new one to continue.
        </Text>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "New password is required" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: "#9ca3af" }} />} placeholder="New password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: "#9ca3af" }} />} placeholder="Confirm new password" />
          </Form.Item>

          {errorMsg && (
            <Alert
              type="error"
              message={errorMsg}
              showIcon
              style={{ marginBottom: 16, borderRadius: 8 }}
              closable
              onClose={() => setErrorMsg(null)}
            />
          )}

          <Button type="primary" htmlType="submit" block loading={submitting}>
            Set Password
          </Button>
        </Form>
      </div>
    </div>
  );
}
