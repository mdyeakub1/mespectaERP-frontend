import { useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Spin,
  Image,
  Statistic,
  Space,
  Card,
} from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchFinishedProductById,
  clearFinishedProductDetails,
} from "../finishedProducts.slice";

const { Title, Text } = Typography;

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

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ paddingBottom: 8 }}>
    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 1 }}>
      {label}
    </Text>
    <Text style={{ fontSize: 14, fontWeight: 500 }}>{value ?? "-"}</Text>
  </div>
);

export default function FinishedProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { details, detailsLoading } = useAppSelector(
    (state) => state.finishedProducts
  );

  useEffect(() => {
    if (id) dispatch(fetchFinishedProductById(Number(id)));
    return () => { dispatch(clearFinishedProductDetails()); };
  }, [dispatch, id]);

  const handlePrintBarcode = () => {
    if (!details?.barcodeImageBase64) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { display:flex; justify-content:center; align-items:center; height:100vh; margin:0; }
            img { width:350px; }
          </style>
        </head>
        <body><img src="data:image/png;base64,${details.barcodeImageBase64}" /></body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => { printWindow.focus(); printWindow.print(); };
  };

  if (detailsLoading || !details)
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );

  const data = details;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* Full-width Back Button */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
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
              FINISHED PRODUCT
            </Text>
            <Title level={3} style={{ color: "#fff", margin: "4px 0 8px" }}>
              {data.barcode}
            </Title>
            <Space size={8}>
              <Tag
                color={data.isSold ? "red" : "green"}
                style={{ border: "none", fontSize: 13, padding: "2px 12px", borderRadius: 20 }}
              >
                {data.isSold ? "Sold" : "Available"}
              </Tag>
              <Tag style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff" }}>
                {data.product?.categoryName}
              </Tag>
              <Tag style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff" }}>
                {data.product?.genderName}
              </Tag>
            </Space>
          </Col>

          <Col>
            <Row gutter={40}>
              <Col>
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Italy</span>}
                  value={data.product?.priceItaly}
                  prefix="€"
                  valueStyle={{ color: "#fff", fontSize: 22 }}
                />
              </Col>
              <Col>
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>EU</span>}
                  value={data.product?.priceEU}
                  prefix="€"
                  valueStyle={{ color: "#fff", fontSize: 22 }}
                />
              </Col>
              <Col>
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Outside EU</span>}
                  value={data.product?.priceOutsideEU}
                  prefix="€"
                  valueStyle={{ color: "#fff", fontSize: 22 }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <Row gutter={24} style={{ alignItems: "flex-start" }}>

        {/* ── LEFT — single card, scrollable ── */}
        <Col span={17}>
          <Card style={{ borderRadius: 12, maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>

            {/* Product */}
            <SectionLabel>Product Information</SectionLabel>
            <Row gutter={32} style={{ marginTop: 8, marginBottom: 16 }}>
              <Col span={12}><Field label="Product Code" value={data.product?.productCode} /></Col>
              <Col span={12}><Field label="Description" value={data.product?.description} /></Col>
              <Col span={12}><Field label="Gender" value={data.product?.genderName} /></Col>
              <Col span={12}><Field label="Category" value={data.product?.categoryName} /></Col>
            </Row>

            {/* Production */}
            <SectionLabel>Production Information</SectionLabel>
            <Row gutter={32} style={{ marginTop: 8, marginBottom: 16 }}>
              <Col span={12}><Field label="Production Code" value={data.production?.productionCode} /></Col>
              <Col span={12}><Field label="Craftsman" value={data.production?.craftsmanName} /></Col>
              <Col span={12}><Field label="Total Working Hours" value={data.production?.totalWorkingHours != null ? (() => { const h = Math.floor(data.production.totalWorkingHours); const m = Math.round((data.production.totalWorkingHours % 1) * 60); return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`; })() : "-"} /></Col>
              <Col span={12}>
                <Field
                  label="Completed At"
                  value={data.production?.completedAt
                    ? new Date(data.production.completedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                    : "-"}
                />
              </Col>
            </Row>

            {/* CITES */}
            <SectionLabel>CITES Information</SectionLabel>
            <Row gutter={32} style={{ marginTop: 8 }}>
              <Col span={12}><Field label="CITES Code" value={data.citesInbound?.citesInboundCode} /></Col>
              <Col span={12}><Field label="CITES Number" value={data.citesInbound?.citesNumber} /></Col>
              <Col span={12}><Field label="Scientific Name" value={data.citesInbound?.scientificName} /></Col>
              <Col span={12}><Field label="Common Name" value={data.citesInbound?.commonName} /></Col>
              <Col span={12}><Field label="Leather Type" value={data.citesInbound?.leatherTypeName} /></Col>
              <Col span={12}><Field label="Color" value={data.citesInbound?.colorName} /></Col>
              <Col span={12}><Field label="Document Type" value={data.citesInbound?.documentTypeName} /></Col>
              <Col span={12}><Field label="Acquisition Type" value={data.citesInbound?.acquisitionTypeName} /></Col>
              <Col span={12}><Field label="Source" value={data.citesInbound?.sourceName} /></Col>
              <Col span={12}><Field label="Quantity Received" value={data.citesInbound?.quantityReceived} /></Col>
              <Col span={12}><Field label="Number of Skins" value={data.citesInbound?.numberOfSkins} /></Col>
              <Col span={12}><Field label="CITES Details" value={data.citesInbound?.citesDetails} /></Col>
              <Col span={12}><Field label="Notes" value={data.citesInbound?.notes} /></Col>
            </Row>

          </Card>
        </Col>

        {/* ── RIGHT BARCODE ── */}
        <Col span={7}>
          <Card style={{ borderRadius: 12, textAlign: "center" }}>
            <Text
              style={{
                fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: 1, color: "#1677ff", display: "block", marginBottom: 16,
              }}
            >
              Barcode
            </Text>

            <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <Image
                preview={false}
                src={`data:image/png;base64,${data.barcodeImageBase64}`}
              />
            </div>

            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 16 }}>
              {data.barcode}
            </Text>

            <Button
              type="primary"
              icon={<PrinterOutlined />}
              style={{ width: "100%", borderRadius: 8 }}
              onClick={handlePrintBarcode}
            >
              Print Barcode
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
