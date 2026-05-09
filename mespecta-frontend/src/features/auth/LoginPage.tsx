import { Form, Input, Button, message, Typography, Alert } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "./auth.slice";

const { Title, Text } = Typography;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    setErrorMsg(null);
    try {
      await dispatch(login(values)).unwrap();
      message.success("Login successful");
      navigate("/");
    } catch (err: any) {
      // err is the rejectWithValue payload (a string) from auth.slice
      const text =
        typeof err === "string"
          ? err
          : err?.message || err?.data?.message || "Invalid email or password.";
      setErrorMsg(text);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* ── LEFT: Form ─────────────────────────────────────────── */}
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 64px",
          background: "#ffffff",
        }}
      >

        {/* Heading */}
        <div style={{ width: "100%", maxWidth: 380, marginBottom: 28 }}>
          <Title level={2} style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 26, color: "#111827" }}>
            Welcome back
          </Title>
          <Text style={{ color: "#6b7280", fontSize: 14 }}>
            Sign in to your account to continue
          </Text>
        </div>

        {/* Form */}
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ width: "100%", maxWidth: 380 }}
          size="large"
        >
          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>Email address</span>}
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
              placeholder="you@example.com"
              style={{ borderRadius: 10, height: 46 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
            style={{ marginBottom: 28 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
              placeholder="••••••••"
              style={{ borderRadius: 10, height: 46 }}
            />
          </Form.Item>

          {errorMsg && (
            <Alert
              type="error"
              title={errorMsg}
              showIcon
              style={{ marginBottom: 16, borderRadius: 8 }}
              closable
              onClose={() => setErrorMsg(null)}
            />
          )}

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{
              height: 48,
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              background: "linear-gradient(135deg, #1677ff 0%, #0050b3 100%)",
              border: "none",
              boxShadow: "0 6px 20px rgba(22,119,255,0.38)",
              letterSpacing: 0.3,
            }}
          >
            Sign In
          </Button>
        </Form>

        <Text style={{ marginTop: 48, color: "#9ca3af", fontSize: 12 }}>
          © {new Date().getFullYear()} Mespecta. All rights reserved.
        </Text>
      </div>

      {/* ── RIGHT: Image panel ─────────────────────────────────── */}
      <div
        style={{
          width: "50%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop"
          alt="Leather goods"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(5,15,40,0.88) 0%, rgba(5,15,40,0.45) 50%, rgba(5,15,40,0.2) 100%)",
          }}
        />

        {/* Bottom text overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 40,
            right: 40,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(22,119,255,0.25)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(22,119,255,0.35)",
              borderRadius: 20,
              padding: "4px 14px",
              marginBottom: 14,
            }}
          >
            <Text style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>
              PREMIUM LEATHER ERP
            </Text>
          </div>

          <Title
            level={2}
            style={{
              color: "#ffffff",
              margin: "0 0 12px",
              fontWeight: 800,
              fontSize: 28,
              lineHeight: 1.2,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            Crafted for precision.<br />Built for scale.
          </Title>

          <Text
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 14,
              lineHeight: 1.65,
              display: "block",
            }}
          >
            Manage CITES compliance, production workflows, inventory,
            and craftsmen from one unified platform.
          </Text>

          {/* Stat pills */}
          <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
            {[
              { value: "CITES", label: "Compliant" },
              { value: "Real-time", label: "Tracking" },
              { value: "Full", label: "ERP Suite" },
            ].map((s) => (
              <div
                key={s.value}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
