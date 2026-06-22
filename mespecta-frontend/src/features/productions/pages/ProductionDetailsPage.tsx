import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Spin,
  Typography,
  Tag,
  Table,
  Tabs,
} from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import api from "../../../services/api";
import { formatHours } from "../../../utils/formatHours";

const { Text } = Typography;

// ── Shared field component — identical to CitesInboundDetailsPage ─────────────
const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ paddingBottom: 12 }}>
    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 2 }}>
      {label}
    </Text>
    <Text style={{ fontSize: 14, fontWeight: 500 }}>{value ?? "-"}</Text>
  </div>
);

const fmt = (val: string | null | undefined) =>
  val ? new Date(val).toLocaleString() : "-";

const getStatusTag = (status: string) => {
  switch (status) {
    case "InProgress":
    case "In Progress":
      return <Tag color="processing">In Progress</Tag>;
    case "Paused":
      return <Tag color="warning">Paused</Tag>;
    case "Completed":
      return <Tag color="success">Completed</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

export default function ProductionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData]           = useState<any>(null);
  const [loading, setLoading]     = useState(false);
  const [qrSrc, setQrSrc]         = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => { fetchDetails(); }, [id]);
  useEffect(() => {
    if (id) fetchQrCode();
    return () => { if (qrSrc) URL.revokeObjectURL(qrSrc); };
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/productions/${id}/details`);
      setData(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchQrCode = async () => {
    try {
      setQrLoading(true);
      const res = await api.get(`/productions/${id}/qrcode`, { responseType: "blob" });
      setQrSrc(URL.createObjectURL(res.data));
    } catch { setQrSrc(null); }
    finally { setQrLoading(false); }
  };

  const handlePrintQR = () => {
    if (!qrSrc) return;
    const w = window.open("", "_blank", "width=600,height=600");
    if (!w) return;
    w.document.write(`<html><head><title>Print QR</title><style>body{display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}img{width:300px;}</style></head><body><img src="${qrSrc}"/></body></html>`);
    w.document.close();
    w.onload = () => { w.focus(); w.print(); };
  };

  if (loading || !data)
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );

  // ── Work log columns ─────────────────────────────────────────────────────────
  const workLogColumns = [
    { title: "Start Time",    dataIndex: "startTime",    render: (v: string) => fmt(v) },
    { title: "End Time",      dataIndex: "endTime",      render: (v: string | null) => fmt(v) },
    { title: "Hours Worked",  dataIndex: "hoursWorked",  render: (v: number) => `${v} hrs` },
    { title: "Pause Reason",  dataIndex: "pauseReason",  render: (v: string | null) => v ?? "-" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* ── Sticky Back Button ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#f5f5f5", paddingBottom: 12, paddingTop: 4 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Row gutter={24} style={{ alignItems: "flex-start" }}>

        {/* ── LEFT — tabbed content ── */}
        <Col span={17}>
          <Card style={{ borderRadius: 12 }}>
            <Tabs
              defaultActiveKey="details"
              items={[
                {
                  key: "details",
                  label: <span><FileTextOutlined style={{ marginRight: 6 }} />Details</span>,
                  children: (
                    <Row gutter={32}>
                      {/* Production */}
                      <Col span={12}><Field label="Outbound Serial No."      value={data.outboundSerialNumber} /></Col>
                      <Col span={12}><Field label="Status"                   value={getStatusTag(data.status)} /></Col>
                      <Col span={12}><Field label="Production Type"          value={data.productionType} /></Col>
                      <Col span={12}><Field label="Total Working Hours"      value={formatHours(data.totalWorkingHours)} /></Col>
                      <Col span={12}><Field label="Created At"               value={fmt(data.createdAt)} /></Col>
                      <Col span={12}><Field label="Completed At"             value={fmt(data.completedAt)} /></Col>

                      {/* Product */}
                      <Col span={12}><Field label="Product Code"             value={data.productCode} /></Col>
                      <Col span={12}><Field label="Product Description"      value={data.productDescription} /></Col>

                      {/* Craftsman */}
                      <Col span={12}><Field label="Craftsman"                value={data.craftsmanName} /></Col>

                      {/* CITES */}
                      <Col span={12}><Field label="CITES Inbound Serial No." value={data.citesInboundSerialNo} /></Col>
                      <Col span={12}><Field label="CITES Number"             value={data.citesNumber} /></Col>
                      <Col span={12}><Field label="Leather Type"             value={data.leatherTypeName} /></Col>
                      <Col span={12}><Field label="Color"                    value={data.colorName} /></Col>

                      {/* Outbound */}
                      <Col span={12}><Field label="Outbound Reason"          value={data.outboundReasonName} /></Col>
                      <Col span={12}><Field label="Outgoing Document Type"   value={data.outgoingDocumentTypeName} /></Col>
                      <Col span={12}><Field label="Destination"              value={data.destinationName} /></Col>
                      <Col span={12}><Field label="Customer"                 value={data.customerName} /></Col>
                      <Col span={12}><Field label="Order ID"                 value={data.orderId} /></Col>
                      <Col span={24}><Field label="Order Description"        value={data.orderDescription} /></Col>
                      <Col span={24}><Field label="Notes"                    value={data.notes} /></Col>
                    </Row>
                  ),
                },
                {
                  key: "worklogs",
                  label: <span><HistoryOutlined style={{ marginRight: 6 }} />Work Logs</span>,
                  children: (
                    <Table
                      rowKey="productionWorkLogId"
                      columns={workLogColumns}
                      dataSource={data.workLogs || []}
                      pagination={{ pageSize: 10, hideOnSinglePage: true }}
                      size="small"
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* ── RIGHT — QR ── */}
        <Col span={7}>
          <Card style={{ borderRadius: 12, textAlign: "center" }}>
            <Text style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#1677ff", display: "block", marginBottom: 16 }}>
              QR Code
            </Text>

            {qrLoading ? (
              <div style={{ padding: "40px 0" }}><Spin /></div>
            ) : qrSrc ? (
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <img src={qrSrc} alt="QR Code" style={{ width: "100%", maxWidth: 220 }} />
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
              disabled={!qrSrc}
            >
              Print QR
            </Button>
          </Card>
        </Col>

      </Row>
    </div>
  );
}
