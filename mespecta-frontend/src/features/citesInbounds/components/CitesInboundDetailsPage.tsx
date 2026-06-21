import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spin,
  Typography,
  Table,
  Tabs,
  Modal,
  Space,
  message,
} from "antd";
import { ArrowLeftOutlined, PrinterOutlined, FileTextOutlined, HistoryOutlined, FilePdfOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import EditCitesInboundModal from "./EditCitesInboundModal";

const { Text } = Typography;

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ paddingBottom: 12 }}>
    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 2 }}>
      {label}
    </Text>
    <Text style={{ fontSize: 14, fontWeight: 500 }}>{value ?? "-"}</Text>
  </div>
);


const formatHours = (hours: number) => {
  const h = Math.floor(hours ?? 0);
  const m = Math.round(((hours ?? 0) % 1) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export default function CitesInboundDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData]               = useState<any>(null);
  const [loading, setLoading]         = useState(false);
  const [qrSrc, setQrSrc]             = useState<string | null>(null);
  const [qrLoading, setQrLoading]     = useState(false);
  const [exportingPdf, setExportingPdf]   = useState(false);
  const [editOpen, setEditOpen]           = useState(false);
  const [deleteOpen, setDeleteOpen]       = useState(false);
  const [deleting, setDeleting]           = useState(false);

  useEffect(() => { fetchDetails(); }, [id]);
  useEffect(() => {
    if (id) fetchQrCode();
    return () => { if (qrSrc) URL.revokeObjectURL(qrSrc); };
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cites-inbounds/${id}`);
      setData(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchQrCode = async () => {
    try {
      setQrLoading(true);
      const res = await api.get(`/cites-inbounds/${id}/qrcode`, { responseType: "blob" });
      setQrSrc(URL.createObjectURL(res.data));
    } catch { setQrSrc(null); }
    finally { setQrLoading(false); }
  };

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true);
      const res = await api.get(`/cites-inbounds/${id}/usage-history/export/pdf`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `usage-history-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent — could add message.error here if needed
    } finally {
      setExportingPdf(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/cites-inbounds/${id}`);
      message.success("CITES Inbound deleted");
      navigate(-1);
    } catch {
      // interceptor handles toast
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
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
    return <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}><Spin size="large" /></div>;

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
              tabBarExtraContent={
                <Space>
                  <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
                    Edit
                  </Button>
                  <Button danger icon={<DeleteOutlined />} onClick={() => setDeleteOpen(true)}>
                    Delete
                  </Button>
                </Space>
              }
              items={[
                {
                  key: "details",
                  label: <span><FileTextOutlined style={{ marginRight: 6 }} />Details</span>,
                  children: (
                    <Row gutter={32}>
                      <Col span={12}><Field label="Scientific Name"  value={data.scientificName} /></Col>
                      <Col span={12}><Field label="Common Name"      value={data.commonName} /></Col>
                      <Col span={12}><Field label="Leather Type"     value={data.leatherTypeName} /></Col>
                      <Col span={12}><Field label="Color"            value={data.colorName} /></Col>
                      <Col span={12}><Field label="Quantity Received" value={data.quantityReceived} /></Col>
                      <Col span={12}><Field label="Unit of Measure"  value={data.unitOfMeasureName} /></Col>
                      <Col span={12}><Field label="Number of Skins"  value={data.numberOfSkins} /></Col>
                      <Col span={12}><Field label="CITES Number"     value={data.citesNumber} /></Col>
                      <Col span={12}><Field label="Issue Date"       value={new Date(data.issueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} /></Col>
                      <Col span={12}><Field label="Document Type"    value={data.documentTypeName} /></Col>
                      <Col span={12}><Field label="Acquisition Type" value={data.acquisitionTypeName} /></Col>
                      <Col span={12}><Field label="Source"           value={data.sourceName} /></Col>
                      <Col span={12}><Field label="Identification"   value={data.identification} /></Col>
                      <Col span={24}><Field label="CITES Details"    value={data.citesDetails} /></Col>
                      <Col span={24}><Field label="Notes"            value={data.notes} /></Col>
                    </Row>
                  ),
                },
                {
                  key: "usage",
                  label: <span><HistoryOutlined style={{ marginRight: 6 }} />Usage History</span>,
                  children: (
                    <>
                      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
                        <Button
                          icon={<FilePdfOutlined />}
                          loading={exportingPdf}
                          onClick={handleExportPdf}
                        >
                          Export PDF
                        </Button>
                      </div>
                    <Table
                      rowKey="outboundSerialNumber"
                      dataSource={data.usageHistories || []}
                      pagination={{ pageSize: 10, hideOnSinglePage: true }}
                      size="small"
                      columns={[
                        { title: "Outbound Serial No.", dataIndex: "outboundSerialNumber" },
                        { title: "Product",             dataIndex: "productCode" },
                        { title: "Qty Used",            dataIndex: "quantityUsed" },
                        { title: "Unit",                dataIndex: "unitOfMeasureName" },
                        { title: "Used Date",           dataIndex: "usedDate",          render: (val: string) => new Date(val).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
                        { title: "Working Hours",       dataIndex: "totalWorkingHours", render: (val: number) => formatHours(val) },
                        { title: "Notes",               dataIndex: "notes" },
                      ]}
                    />
                    </>
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

      <EditCitesInboundModal
        open={editOpen}
        id={id!}
        data={data}
        onClose={() => setEditOpen(false)}
        onSuccess={fetchDetails}
      />

      <Modal
        title="Delete CITES Inbound"
        open={deleteOpen}
        onOk={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true, loading: deleting }}
        destroyOnHidden
      >
        Are you sure you want to delete CITES Inbound{" "}
        <strong>{data?.citesNumber || `#${id}`}</strong>? This action cannot be undone.
      </Modal>
    </div>
  );
}
