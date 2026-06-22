import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spin, Typography, Tag, Table } from "antd";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { formatHours } from "../../../utils/formatHours";

const { Text } = Typography;

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ paddingBottom: 12 }}>
    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 2 }}>{label}</Text>
    <Text style={{ fontSize: 14, fontWeight: 500 }}>{value ?? "-"}</Text>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{
      fontSize: 11, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: 1, color: "#1677ff", borderBottom: "2px solid #e2e8f0",
      paddingBottom: 6, marginBottom: 14,
    }}>
      {title}
    </div>
    {children}
  </div>
);

const formatDate = (val: string | null) =>
  val ? new Date(val).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";


export default function FinishedProductDetailsPage() {
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
      const res = await api.get(`/finished-products/${id}`);
      setData(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchQrCode = async () => {
    try {
      setQrLoading(true);
      const res = await api.get(`/finished-products/${id}/qrcode`, { responseType: "blob" });
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
    return <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}><Spin size="large" /></div>;

  const { product, production, citesInbound, customer } = data;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#f5f5f5", paddingBottom: 12, paddingTop: 4 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Row gutter={24} style={{ alignItems: "flex-start" }}>

        {/* ── LEFT — all sections ── */}
        <Col span={17}>
          <Card style={{ borderRadius: 12 }}>
            <div>

              {/* ── CITES Outbound Info ── */}
              <Section title="CITES Outbound Info">
                <Row gutter={32}>
                  <Col span={12}><Field label="Serial No."          value={citesInbound?.citesInboundSerialNo} /></Col>
                  <Col span={12}><Field label="Outbound Serial No." value={production?.outboundSerialNumber} /></Col>
                  <Col span={12}><Field label="Scientific Name"    value={citesInbound?.scientificName} /></Col>
                  <Col span={12}><Field label="Common Name"        value={citesInbound?.commonName} /></Col>
                  <Col span={12}><Field label="Acquisition Type"   value={citesInbound?.acquisitionTypeName} /></Col>
                  <Col span={12}><Field label="Source"             value={citesInbound?.sourceName} /></Col>
                  <Col span={12}><Field label="Document Type"      value={citesInbound?.documentTypeName} /></Col>
                  <Col span={12}><Field label="CITES Document"     value={citesInbound?.citesNumber} /></Col>
                  <Col span={12}><Field label="Identification"     value={citesInbound?.identification} /></Col>
                  <Col span={12}><Field label="Quantity"           value={citesInbound?.quantityUsed != null ? `${citesInbound.quantityUsed} ${citesInbound.quantityUsedUnit}` : null} /></Col>
                  <Col span={12}><Field label="Inbound Reference"  value={citesInbound?.citesInboundSerialNo} /></Col>
                  <Col span={12}><Field label="Outbound Reason"    value={production?.outboundReason} /></Col>
                  <Col span={12}><Field label="Outgoing Document"  value={production?.outgoingDocumentType} /></Col>
                  <Col span={24}><Field label="Destination"        value={production?.destination} /></Col>
                </Row>
              </Section>

              {/* ── Product Info ── */}
              <Section title="Product Info">
                <Row gutter={32}>
                  <Col span={12}><Field label="Product Code" value={product?.productCode} /></Col>
                  <Col span={12}><Field label="Category" value={product?.categoryName} /></Col>
                  <Col span={12}><Field label="Description" value={product?.description} /></Col>
                  <Col span={12}><Field label="Gender" value={product?.genderName} /></Col>
                  <Col span={8}><Field label="Price (Italy)" value={product?.priceItaly != null ? `€${product.priceItaly.toFixed(2)}` : null} /></Col>
                  <Col span={8}><Field label="Price (EU)" value={product?.priceEU != null ? `€${product.priceEU.toFixed(2)}` : null} /></Col>
                  <Col span={8}><Field label="Price (Outside EU)" value={product?.priceOutsideEU != null ? `€${product.priceOutsideEU.toFixed(2)}` : null} /></Col>
                </Row>

                {product?.materials?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 10 }}>Materials</Text>
                    <Row gutter={[12, 12]}>
                      {product.materials.map((m: any, i: number) => (
                        <Col span={12} key={i}>
                          <div style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: "12px 16px",
                            background: "#f8fafc",
                          }}>
                            <Text style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
                              {m.materialName}
                            </Text>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>{m.materialCategoryName}</Text>
                              <Text style={{ fontSize: 12, fontWeight: 500 }}>
                                {m.quantityRequired} {m.unitOfMeasureName}
                              </Text>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </Section>

              {/* ── Production Info ── */}
              <Section title="Production Info">
                <Row gutter={32}>
                  <Col span={12}><Field label="Production Type" value={production?.productionType} /></Col>
                  <Col span={12}><Field label="Craftsman" value={production?.craftsmanName} /></Col>
                  <Col span={12}><Field label="Total Working Hours" value={production?.totalWorkingHours != null ? formatHours(production.totalWorkingHours) : null} /></Col>
                  <Col span={12}><Field label="Started At" value={formatDate(production?.createdAt)} /></Col>
                  <Col span={12}><Field label="Completed At" value={formatDate(production?.completedAt)} /></Col>
                  <Col span={12}>
                    <Field label="Status" value={<Tag color={data.isSold ? "green" : "orange"}>{data.status}</Tag>} />
                  </Col>
                  {data.isSold && <Col span={12}><Field label="Sold At" value={formatDate(data.soldAt)} /></Col>}
                  {customer && (
                    <>
                      <Col span={12}><Field label="Customer Name" value={customer.name} /></Col>
                      <Col span={12}><Field label="Order ID" value={customer.orderId} /></Col>
                      {customer.description && <Col span={24}><Field label="Description" value={customer.description} /></Col>}
                    </>
                  )}
                </Row>
                {production?.workLogs?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>Work Logs</Text>
                    <Table
                      rowKey="startTime"
                      dataSource={production.workLogs}
                      pagination={false}
                      size="small"
                      columns={[
                        { title: "Start",        dataIndex: "startTime",   render: (v: string) => formatDate(v) },
                        { title: "End",          dataIndex: "endTime",     render: (v: string) => formatDate(v) },
                        { title: "Hours Worked", dataIndex: "hoursWorked", render: (v: number) => formatHours(v) },
                        { title: "Pause Reason", dataIndex: "pauseReason" },
                      ]}
                    />
                  </div>
                )}
              </Section>

            </div>
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
            <Button type="primary" icon={<PrinterOutlined />} style={{ width: "100%", borderRadius: 8 }} onClick={handlePrintQR} disabled={!qrSrc}>
              Print QR
            </Button>
          </Card>
        </Col>

      </Row>
    </div>
  );
}
