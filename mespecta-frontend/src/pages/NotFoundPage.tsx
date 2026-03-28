import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f8fafc",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: 900,
          lineHeight: 1,
          background: "linear-gradient(135deg, #1677ff 0%, #0050b3 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 16,
        }}
      >
        404
      </div>

      <Title level={3} style={{ margin: "0 0 8px", color: "#111827" }}>
        Page Not Found
      </Title>

      <Text type="secondary" style={{ fontSize: 14, marginBottom: 32, display: "block" }}>
        The page you're looking for doesn't exist or has been moved.
      </Text>

      <Button type="primary" size="large" style={{ borderRadius: 8 }} onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </div>
  );
}
