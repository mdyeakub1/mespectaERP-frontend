import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Tabs,
  Button,
  Image,
  Spin,
  Typography,
  Table,
  Tag,
  Statistic,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  FileTextOutlined,
  HistoryOutlined,
  PaperClipOutlined,
  CalendarOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

const { Title, Text } = Typography;

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ paddingBottom: 8 }}>
    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 1 }}>
      {label}
    </Text>
    <Text style={{ fontSize: 14, fontWeight: 500 }}>{value ?? "-"}</Text>
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text
    style={{
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#1677ff",
      display: "block",
      marginBottom: 4,
    }}
  >
    {children}
  </Text>
);

const formatHours = (hours: number) => {
  const h = Math.floor(hours ?? 0);
  const m = Math.round(((hours ?? 0) % 1) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export default function CitesInboundDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchDetails(); }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cites-inbounds/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintQR = () => {
    if (!data?.qrCode) return;
    const printWindow = window.open("", "_blank", "width=1000,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>Print QR</title>
          <style>body{display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}img{width:300px;}</style>
        </head>
        <body><img src="${data.qrCode}" /></body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.focus(); printWindow.print(); };
  };

  if (loading || !data)
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {/* ── Hero Header ── */}
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
              CITES INBOUND
            </Text>
            <Title level={3} style={{ color: "#fff", margin: "4px 0 8px" }}>
              {data.citesInboundCode}
            </Title>
            <Space size={8}>
              <Tag icon={<CalendarOutlined />} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff" }}>
                {new Date(data.issueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </Tag>
              <Tag icon={<NumberOutlined />} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff" }}>
                {data.citesNumber}
              </Tag>
              {data.isLiveAnimal && (
                <Tag color="green" style={{ border: "none" }}>Live Animal</Tag>
              )}
            </Space>
          </Col>

          <Col>
            <Row gutter={32}>
              <Col>
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Quantity</span>}
                  value={data.quantityReceived}
                  suffix={<span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{data.unitOfMeasureName}</span>}
                  valueStyle={{ color: "#fff", fontSize: 28 }}
                />
              </Col>
              <Col>
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Skins</span>}
                  value={data.numberOfSkins}
                  valueStyle={{ color: "#fff", fontSize: 28 }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <Row gutter={24} style={{ alignItems: "flex-start" }}>

        {/* ── LEFT — single card ── */}
        <Col span={17}>
          <Card style={{ borderRadius: 12 }}>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: <Space><FileTextOutlined />Details</Space>,
                  children: (
                    <div style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto", overflowX: "hidden", paddingRight: 4 }}>

                      <SectionLabel>Species</SectionLabel>
                      <Row gutter={32} style={{ marginTop: 8, marginBottom: 16 }}>
                        <Col span={12}><Field label="Scientific Name" value={data.scientificName} /></Col>
                        <Col span={12}><Field label="Common Name" value={data.commonName} /></Col>
                        <Col span={12}><Field label="Leather Type" value={data.leatherTypeName} /></Col>
                        <Col span={12}><Field label="Color" value={data.colorName} /></Col>
                      </Row>

                      <SectionLabel>Quantity</SectionLabel>
                      <Row gutter={32} style={{ marginTop: 8, marginBottom: 16 }}>
                        <Col span={12}>
                          <Field label="Quantity Received" value={`${data.quantityReceived ?? "-"} ${data.unitOfMeasureName ?? ""}`} />
                        </Col>
                        <Col span={12}><Field label="Number of Skins" value={data.numberOfSkins} /></Col>
                      </Row>

                      <SectionLabel>Documentation</SectionLabel>
                      <Row gutter={32} style={{ marginTop: 8, marginBottom: 16 }}>
                        <Col span={12}><Field label="CITES Number" value={data.citesNumber} /></Col>
                        <Col span={12}><Field label="Issue Date" value={new Date(data.issueDate).toLocaleDateString()} /></Col>
                        <Col span={12}><Field label="Document Type" value={data.documentTypeName} /></Col>
                        <Col span={12}><Field label="Acquisition Type" value={data.acquisitionTypeName} /></Col>
                        <Col span={12}><Field label="Source" value={data.sourceName} /></Col>
                        <Col span={12}>
                          <Field
                            label="Live Animal"
                            value={data.isLiveAnimal ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>}
                          />
                        </Col>
                      </Row>

                      <SectionLabel>Notes</SectionLabel>
                      <Row gutter={32} style={{ marginTop: 8 }}>
                        <Col span={24}><Field label="CITES Details" value={data.citesDetails} /></Col>
                        <Col span={24}><Field label="Notes" value={data.notes} /></Col>
                      </Row>

                    </div>
                  ),
                },

                {
                  key: "2",
                  label: <Space><HistoryOutlined />Usage History</Space>,
                  children: (
                    <Table
                      rowKey="productionCode"
                      dataSource={data.usageHistories || []}
                      pagination={false}
                      style={{ marginTop: 8 }}
                      columns={[
                        { title: "Production Code", dataIndex: "productionCode" },
                        { title: "Product", dataIndex: "productCode" },
                        { title: "Qty Used", dataIndex: "quantityUsed" },
                        { title: "Unit", dataIndex: "unitOfMeasureName" },
                        {
                          title: "Used Date",
                          dataIndex: "usedDate",
                          render: (val: string) => new Date(val).toLocaleDateString(),
                        },
                        {
                          title: "Working Hours",
                          dataIndex: "totalWorkingHours",
                          render: (val: number) => formatHours(val),
                        },
                        { title: "Notes", dataIndex: "notes" },
                      ]}
                    />
                  ),
                },

                {
                  key: "3",
                  label: <Space><PaperClipOutlined />Attachments</Space>,
                  children: (
                    <Table
                      rowKey="citesInboundAttachmentId"
                      dataSource={data.attachments || []}
                      pagination={false}
                      style={{ marginTop: 8 }}
                      columns={[
                        { title: "File Name", dataIndex: "fileName" },
                        { title: "Type", dataIndex: "contentType" },
                        {
                          title: "Size (KB)",
                          dataIndex: "fileSize",
                          render: (val: number) => (val / 1024).toFixed(2),
                        },
                        {
                          title: "Uploaded At",
                          dataIndex: "uploadedAt",
                          render: (val: string) => new Date(val).toLocaleDateString(),
                        },
                      ]}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* ── RIGHT QR ── */}
        <Col span={7}>
          <Card style={{ borderRadius: 12, textAlign: "center" }}>
            <Text
              style={{
                fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: 1, color: "#1677ff", display: "block", marginBottom: 16,
              }}
            >
              QR Code
            </Text>

            {data.qrCode ? (
              <div id="qr-print-area" style={{ background: "#f8fafc", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <Image src={data.qrCode} preview={false} />
              </div>
            ) : (
              <div style={{ background: "#fafafa", borderRadius: 8, padding: "40px 0", color: "#bfbfbf", fontSize: 13, marginBottom: 12 }}>
                No QR Available
              </div>
            )}

            <Button
              type="primary"
              icon={<PrinterOutlined />}
              style={{ width: "100%", borderRadius: 8 }}
              onClick={handlePrintQR}
              disabled={!data.qrCode}
            >
              Print QR
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
