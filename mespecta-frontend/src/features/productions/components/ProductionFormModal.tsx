import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Segmented,
  Row,
  Col,
  Card,
  Divider,
  Typography,
  Table,
  message,
  Button,
} from "antd";
import api from "../../../services/api";
import { getProductById } from "../../products/products.api";
import {
  startProduction,
  updateProduction,
  searchCitesInboundByNumber,
} from "../productions.api";

const { Text } = Typography;
const { TextArea } = Input;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any; // production details — presence means "edit mode"
}

export default function ProductionFormModal({ open, onClose, onSuccess, initialData }: Props) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initialData);

  const [submitting, setSubmitting] = useState(false);

  const [citesSearchValue, setCitesSearchValue] = useState("");
  const [searchingCites, setSearchingCites] = useState(false);
  const [selectedInbound, setSelectedInbound] = useState<any>(null);

  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [outboundReasons, setOutboundReasons] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [outgoingDocumentTypes, setOutgoingDocumentTypes] = useState<any[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  const productionType = Form.useWatch("productionType", form);
  const citesInboundId = Form.useWatch("citesInboundId", form);
  const productId = Form.useWatch("productId", form);
  const outboundReasonId = Form.useWatch("outboundReasonId", form);
  const destinationId = Form.useWatch("destinationId", form);
  const outgoingDocumentTypeId = Form.useWatch("outgoingDocumentTypeId", form);
  const orderId = Form.useWatch("orderId", form);
  const customerName = Form.useWatch("customerName", form);

  const canSubmit = Boolean(
    citesInboundId &&
      productId &&
      productionType &&
      outboundReasonId &&
      destinationId &&
      outgoingDocumentTypeId &&
      (productionType !== "Sold" || ((orderId ?? "").trim() && (customerName ?? "").trim()))
  );

  /* ── Load static dropdowns ── */
  useEffect(() => {
    if (!open) return;
    const loadDropdowns = async () => {
      try {
        setLoadingDropdowns(true);
        const [reasonsRes, destRes, docRes] = await Promise.all([
          api.get("/outbound-reasons"),
          api.get("/destinations"),
          api.get("/outgoing-document-types"),
        ]);
        setOutboundReasons(reasonsRes.data?.data ?? []);
        setDestinations(destRes.data?.data ?? []);
        setOutgoingDocumentTypes(docRes.data?.data ?? []);
      } catch {
        // interceptor handles toast
      } finally {
        setLoadingDropdowns(false);
      }
    };
    loadDropdowns();
  }, [open]);

  /* ── Prefill on edit ── */
  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        citesInboundId: initialData.citesInboundId,
        productId: initialData.productId,
        productionType: initialData.productionType,
        outboundReasonId: initialData.outboundReasonId,
        destinationId: initialData.destinationId,
        outgoingDocumentTypeId: initialData.outgoingDocumentTypeId,
        orderId: initialData.orderId,
        customerName: initialData.customerName,
        orderDescription: initialData.orderDescription,
        notes: initialData.notes,
      });

      setSelectedInbound({
        citesInboundId: initialData.citesInboundId,
        citesNumber: initialData.citesNumber,
        leatherTypeName: initialData.leatherTypeName,
        colorName: initialData.colorName,
        quantityReceived: initialData.quantityReceived,
      });

      if (initialData.productId) {
        getProductById(initialData.productId)
          .then((product) => {
            setSelectedProduct(product);
            setProductOptions([product]);
          })
          .catch(() => {});
      }
    } else if (open && !initialData) {
      form.resetFields();
      setSelectedInbound(null);
      setSelectedProduct(null);
      setProductOptions([]);
      setCitesSearchValue("");
    }
  }, [open, initialData, form]);

  /* ── CITES search ── */
  const handleCitesSearch = async () => {
    if (!citesSearchValue.trim()) return;
    try {
      setSearchingCites(true);
      const result = await searchCitesInboundByNumber(citesSearchValue.trim());
      if (!result) {
        message.error("CITES Inbound not found");
        return;
      }
      setSelectedInbound(result);
      form.setFieldsValue({ citesInboundId: result.citesInboundId });
    } catch {
      message.error("CITES Inbound not found");
    } finally {
      setSearchingCites(false);
    }
  };

  /* ── Product search ── */
  const handleProductSearch = async (value: string) => {
    if (!value) {
      setProductOptions([]);
      return;
    }
    try {
      setSearchingProducts(true);
      const res = await api.get("/products", { params: { search: value, pageSize: 10 } });
      const items = res.data?.data?.items ?? res.data?.data ?? [];
      setProductOptions(items);
    } catch {
      setProductOptions([]);
    } finally {
      setSearchingProducts(false);
    }
  };

  const handleProductSelect = async (value: number) => {
    form.setFieldsValue({ productId: value });
    try {
      const product = await getProductById(value);
      setSelectedProduct(product);
    } catch {
      setSelectedProduct(null);
    }
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload = {
        productId: values.productId,
        citesInboundId: values.citesInboundId,
        productionType: values.productionType,
        customerName: values.productionType === "Sold" ? values.customerName?.trim() : "",
        orderId: values.productionType === "Sold" ? values.orderId?.trim() : "",
        orderDescription: values.productionType === "Sold" ? values.orderDescription?.trim() || "" : "",
        outboundReasonId: values.outboundReasonId,
        outgoingDocumentTypeId: values.outgoingDocumentTypeId,
        destinationId: values.destinationId,
        notes: values.notes?.trim() || "",
      };

      if (isEdit) {
        await updateProduction(initialData.productionId, payload);
        message.success("Production updated");
      } else {
        await startProduction(payload);
        message.success("Production started");
      }

      onSuccess?.();
      onClose();
    } catch {
      // interceptor handles toast / form validation errors
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Production" : "Start Production"}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={submitting} disabled={!canSubmit} onClick={handleSubmit}>
          {isEdit ? "Save Changes" : "Start Production"}
        </Button>,
      ]}
      width={900}
      destroyOnHidden
    >
      <Form layout="vertical" form={form}>
        {/* ── CITES Inbound ── */}
        <Form.Item label="Search CITES Inbound" required>
          <Input.Search
            placeholder="Enter CITES Number (e.g. DE-E-01469/17)"
            value={citesSearchValue}
            onChange={(e) => setCitesSearchValue(e.target.value)}
            onSearch={handleCitesSearch}
            loading={searchingCites}
            enterButton="Search"
          />
        </Form.Item>

        <Form.Item name="citesInboundId" rules={[{ required: true, message: "Select a CITES Inbound" }]} hidden>
          <Input />
        </Form.Item>

        {selectedInbound && (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: 12 }}>CITES Number</Text>
                <div><Text strong>{selectedInbound.citesNumber}</Text></div>
              </Col>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: 12 }}>Leather Type</Text>
                <div><Text strong>{selectedInbound.leatherTypeName}</Text></div>
              </Col>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: 12 }}>Color</Text>
                <div><Text strong>{selectedInbound.colorName}</Text></div>
              </Col>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: 12 }}>Quantity</Text>
                <div><Text strong>{selectedInbound.quantityReceived}</Text></div>
              </Col>
            </Row>
          </Card>
        )}

        <Divider />

        {/* ── Product ── */}
        <Form.Item label="Product" name="productId" rules={[{ required: true, message: "Select a product" }]}>
          <Select
            showSearch
            placeholder="Search product by code"
            filterOption={false}
            loading={searchingProducts}
            onSearch={handleProductSearch}
            onChange={handleProductSelect}
            options={productOptions.map((p) => ({
              value: p.productId,
              label: p.productCode,
            }))}
          />
        </Form.Item>

        {selectedProduct && (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Text type="secondary" style={{ fontSize: 12 }}>Product Code</Text>
                <div><Text strong>{selectedProduct.productCode}</Text></div>
              </Col>
              <Col span={16}>
                <Text type="secondary" style={{ fontSize: 12 }}>Description</Text>
                <div><Text strong>{selectedProduct.description}</Text></div>
              </Col>
            </Row>

            {selectedProduct.leathers?.length > 0 && (
              <>
                <Divider style={{ margin: "12px 0" }} />
                <Text strong style={{ fontSize: 12 }}>Required Leather</Text>
                <Table
                  size="small"
                  rowKey="productLeatherId"
                  pagination={false}
                  style={{ marginTop: 8 }}
                  columns={[
                    { title: "Leather Type", dataIndex: "leatherTypeName" },
                    { title: "Qty", dataIndex: "quantityRequired" },
                    { title: "Unit", dataIndex: "unitOfMeasureName" },
                  ]}
                  dataSource={selectedProduct.leathers}
                />
              </>
            )}

            {selectedProduct.materials?.length > 0 && (
              <>
                <Divider style={{ margin: "12px 0" }} />
                <Text strong style={{ fontSize: 12 }}>Required Materials</Text>
                <Table
                  size="small"
                  rowKey="productMaterialId"
                  pagination={false}
                  style={{ marginTop: 8 }}
                  columns={[
                    { title: "Material", dataIndex: "materialName" },
                    { title: "Qty", dataIndex: "quantityRequired" },
                    { title: "Unit", dataIndex: "unitOfMeasureName" },
                  ]}
                  dataSource={selectedProduct.materials}
                />
              </>
            )}
          </Card>
        )}

        <Divider />

        {/* ── Production Type ── */}
        <Form.Item label="Production Type" name="productionType" rules={[{ required: true }]}>
          <Segmented options={["Stock", "Sold"]} />
        </Form.Item>

        {/* ── Outbound Reason / Destination / Document Type ── */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Outbound Reason" name="outboundReasonId" rules={[{ required: true }]}>
              <Select
                placeholder="- select -"
                loading={loadingDropdowns}
                options={outboundReasons.map((r) => ({ value: r.outboundReasonId ?? r.id, label: r.name }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Destination" name="destinationId" rules={[{ required: true }]}>
              <Select
                placeholder="- select -"
                loading={loadingDropdowns}
                options={destinations.map((d) => ({ value: d.destinationId ?? d.id, label: d.name }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Outgoing Document Type" name="outgoingDocumentTypeId" rules={[{ required: true }]}>
              <Select
                placeholder="- select -"
                loading={loadingDropdowns}
                options={outgoingDocumentTypes.map((d) => ({ value: d.outgoingDocumentTypeId ?? d.id, label: d.name }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ── Sold-only fields ── */}
        {productionType === "Sold" && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Order ID"
                name="orderId"
                rules={[{ required: true, message: "Order ID is required for Sold" }]}
              >
                <Input placeholder="e.g. ORD-1001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[{ required: true, message: "Customer name is required for Sold" }]}
              >
                <Input placeholder="e.g. Jack Jones" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Order Description" name="orderDescription">
                <TextArea rows={2} placeholder="e.g. Custom crocodile bag" />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item label="Notes" name="notes">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
