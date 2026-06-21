import { Drawer, Row, Col, Table, Spin, Typography, Tag } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchProductById } from "../products.slice";

const { Text } = Typography;

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ paddingBottom: 14 }}>
    <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {label}
    </Text>
    <Text style={{ fontSize: 14, fontWeight: 500 }}>{value ?? "-"}</Text>
  </div>
);

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ margin: "16px 0 12px" }}>
    <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#1677ff" }}>
      {children}
    </Text>
    <div style={{ height: 1, background: "#e8f0fe", marginTop: 4 }} />
  </div>
);

interface Props {
  open: boolean;
  productId: number | null;
  onClose: () => void;
}

export default function ProductDetailsDrawer({ open, productId, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { details, detailsLoading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (open && productId) dispatch(fetchProductById(productId));
  }, [open, productId, dispatch]);

  return (
    <Drawer
      title={
        <span>
          Product Details
          {details?.productCode && (
            <Tag color="blue" style={{ marginLeft: 10, fontWeight: 600 }}>
              {details.productCode}
            </Tag>
          )}
        </span>
      }
      width={750}
      open={open}
      onClose={onClose}
      destroyOnHidden
    >
      {detailsLoading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* ── Product Info ── */}
          <SectionLabel>Product Information</SectionLabel>

          <Row gutter={24}>
            <Col span={12}>
              <Field label="Product Code" value={details?.productCode} />
            </Col>
            <Col span={12}>
              <Field label="Description" value={details?.description} />
            </Col>
            <Col span={12}>
              <Field label="Category" value={details?.categoryName} />
            </Col>
            <Col span={12}>
              <Field label="Gender" value={details?.genderName} />
            </Col>
          </Row>

          {/* ── Prices ── */}
          <SectionLabel>Prices</SectionLabel>

          <Row gutter={24}>
            <Col span={8}>
              <Field
                label="Price Italy"
                value={details?.priceItaly != null ? `€ ${details.priceItaly}` : null}
              />
            </Col>
            <Col span={8}>
              <Field
                label="Price EU"
                value={details?.priceEU != null ? `€ ${details.priceEU}` : null}
              />
            </Col>
            <Col span={8}>
              <Field
                label="Price Outside EU"
                value={details?.priceOutsideEU != null ? `€ ${details.priceOutsideEU}` : null}
              />
            </Col>
          </Row>

          {/* ── CITES Leather ── */}
          <SectionLabel>CITES Leather</SectionLabel>

          <Table
            size="small"
            rowKey="productLeatherId"
            columns={[
              { title: "Leather Type",  dataIndex: "leatherTypeName",  ellipsis: true },
              { title: "Required Qty",  dataIndex: "quantityRequired",  width: 110 },
              { title: "Unit",          dataIndex: "unitOfMeasureName", width: 80 },
              { title: "Note",          dataIndex: "note",              ellipsis: true, render: (v: string) => v || "-" },
            ]}
            dataSource={details?.leathers || []}
            pagination={false}
            locale={{ emptyText: "No leather specified" }}
          />

          {/* ── Materials ── */}
          <SectionLabel>Materials</SectionLabel>

          <Table
            size="small"
            rowKey="productMaterialId"
            columns={[
              { title: "Material",      dataIndex: "materialName",      ellipsis: true },
              { title: "Required Qty",  dataIndex: "quantityRequired",  width: 110 },
              { title: "Unit",          dataIndex: "unitOfMeasureName", width: 80 },
              { title: "Note",          dataIndex: "note",              ellipsis: true, render: (v: string) => v || "-" },
            ]}
            dataSource={details?.materials || []}
            pagination={false}
            locale={{ emptyText: "No materials specified" }}
          />
        </>
      )}
    </Drawer>
  );
}
