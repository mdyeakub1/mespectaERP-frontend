import {
  Avatar,
  Spin,
  Row,
  Col,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  CalendarOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { fetchAccount } from "../account.slice";
import { changePassword } from "../account.api";

const { Title, Text } = Typography;

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <Row align="middle" style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
    <Col style={{ width: 36, color: "#1677ff", fontSize: 16 }}>{icon}</Col>
    <Col flex={1}>
      <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
        {label}
      </Text>
      <Text style={{ fontWeight: 500 }}>{value}</Text>
    </Col>
  </Row>
);

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.account);

  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  const handleChangePassword = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.success) {
        message.success(response.message);
        form.resetFields();
        setModalOpen(false);
      } else {
        message.error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: "block", marginTop: 80 }} />;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 32 }}>

      {/* ── Profile Hero ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1677ff 0%, #0050b3 100%)",
          borderRadius: 16,
          padding: "32px 32px 64px",
          position: "relative",
          marginBottom: 56,
        }}
      >
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, letterSpacing: 1 }}>
          ACCOUNT
        </Text>
        <Title level={3} style={{ color: "#fff", margin: "4px 0 0" }}>
          {data?.fullName}
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.8)" }}>{data?.email}</Text>

        {/* Avatar overlapping the card below */}
        <Avatar
          size={80}
          icon={<UserOutlined />}
          style={{
            position: "absolute",
            bottom: -40,
            left: 32,
            border: "4px solid #fff",
            backgroundColor: "#1677ff",
            fontSize: 32,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* ── Info Card ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "24px 32px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #f1f5f9",
        }}
      >
        {/* Name + role + status row */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              {data?.fullName}
            </Title>
            <Row gutter={8} style={{ marginTop: 6 }}>
              <Col>
                <Tag color="blue" style={{ borderRadius: 20, padding: "0 10px" }}>
                  {data?.role}
                </Tag>
              </Col>
              <Col>
                {data?.isActive ? (
                  <Tag color="green" style={{ borderRadius: 20, padding: "0 10px" }}>Active</Tag>
                ) : (
                  <Tag color="red" style={{ borderRadius: 20, padding: "0 10px" }}>Inactive</Tag>
                )}
              </Col>
            </Row>
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ borderRadius: 8 }}
            >
              Change Password
            </Button>
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        {/* Info rows */}
        <InfoRow icon={<IdcardOutlined />} label="User ID" value={`#${data?.userId}`} />
        <InfoRow icon={<UserOutlined />} label="Full Name" value={data?.fullName} />
        <InfoRow icon={<MailOutlined />} label="Email" value={data?.email} />
        <InfoRow
          icon={<CalendarOutlined />}
          label="Member Since"
          value={new Date(data?.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        />
      </div>

      {/* ── Change Password Modal ── */}
      <Modal
        title="Change Password"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleChangePassword}
        confirmLoading={submitting}
        okText="Update Password"
        destroyOnHidden
      >
        <Form layout="vertical" form={form} style={{ marginTop: 8 }}>
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: "Please enter current password" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
