import { useEffect } from "react";
import { Card, Row, Col, Button, Spin, Typography, Table, Tag, Statistic, Space } from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCraftsmanById, clearCraftsmanDetails } from "../craftsmen.slice";

const { Title, Text } = Typography;

const formatHours = (hours: number) => {
  const h = Math.floor(hours ?? 0);
  const m = Math.round(((hours ?? 0) % 1) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export default function CraftsmanDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { details, detailsLoading } = useAppSelector((state) => state.craftsmen);

  useEffect(() => {
    if (id) dispatch(fetchCraftsmanById(Number(id)));
    return () => { dispatch(clearCraftsmanDetails()); };
  }, [dispatch, id]);

  if (detailsLoading || !details)
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );

  const data = details;

  const columns = [
    { title: "Outbound Serial No.", dataIndex: "outboundSerialNumber" },
    { title: "Product", dataIndex: "productCode" },
    { title: "CITES", dataIndex: "citesNumber" },
    { title: "Leather", dataIndex: "leatherTypeName" },
    { title: "Color", dataIndex: "colorName" },
    {
      title: "Working Hours",
      dataIndex: "totalWorkingHours",
      render: (val: number) => formatHours(val),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      render: (val: string) => val || "-",
    },
    {
      title: "Type",
      dataIndex: "productionType",
      render: (val: number) =>
        val === 1 ? <Tag color="blue">Stock</Tag> : <Tag color="purple">Custom</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (val: number | string) => {
        switch (val) {
          case 1: case "InProgress": case "In Progress": return <Tag color="processing">In Progress</Tag>;
          case 2: case "Paused":                         return <Tag color="warning">Paused</Tag>;
          case 3: case "Completed":                      return <Tag color="success">Completed</Tag>;
          default:                                       return <Tag>{String(val)}</Tag>;
        }
      },
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* Back */}
      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {/* ── Hero Summary Card ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1677ff 0%, #0050b3 100%)",
          borderRadius: 12,
          padding: "24px 32px",
          marginBottom: 24,
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, letterSpacing: 1 }}>
              CRAFTSMAN
            </Text>
            <Title level={3} style={{ color: "#fff", margin: "4px 0 8px" }}>
              {data.fullName}
            </Title>
            <Space size={8}>
              <Tag
                icon={<MailOutlined />}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff" }}
              >
                {data.email}
              </Tag>
              <Tag
                icon={data.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff" }}
              >
                {data.isActive ? "Active" : "Inactive"}
              </Tag>
              <Tag
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff" }}
              >
                Since {new Date(data.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </Tag>
            </Space>
          </Col>

          <Col>
            <Row gutter={48}>
              <Col>
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Total Productions</span>}
                  value={data.totalProductions ?? 0}
                  valueStyle={{ color: "#fff", fontSize: 28 }}
                />
              </Col>
              <Col>
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Active</span>}
                  value={data.activeProductions ?? 0}
                  valueStyle={{ color: "#fff", fontSize: 28 }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* ── Production History Table ── */}
      <Card style={{ borderRadius: 12 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "#1677ff",
            display: "block",
            marginBottom: 16,
          }}
        >
          Production History
        </Text>

        <Table
          rowKey="outboundSerialNumber"
          columns={columns}
          dataSource={data.productions || []}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
        />
      </Card>

    </div>
  );
}
