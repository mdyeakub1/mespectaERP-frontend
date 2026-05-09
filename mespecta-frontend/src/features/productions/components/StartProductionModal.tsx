import {
  Modal,
  Form,
  Input,
  InputNumber,
  Cascader,
  Row,
  Col,
  Card,
  Divider,
  Typography,
  Select,
  Table,
  message,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAppDispatch } from "../../../app/hooks";
import { createProduction } from "../productions.slice";

const { Text } = Typography;
const { TextArea } = Input;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StartProductionModal({
  open,
  onClose,
}: Props) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [inbound, setInbound] = useState<any>(null);
  const [productTree, setProductTree] = useState<any[]>([]);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [uoms, setUoms] = useState<any[]>([]);

  /* ------------------ Load Data ------------------ */
  useEffect(() => {
    if (open) {
      loadProducts();
      loadUoms();
    }
  }, [open]);

  const loadProducts = async () => {
    const res = await api.get("/products");
    const products = res.data;

    const grouped: any = {};

    products.forEach((p: any) => {
      if (!grouped[p.genderName])
        grouped[p.genderName] = {};

      if (!grouped[p.genderName][p.categoryName])
        grouped[p.genderName][p.categoryName] = [];

      grouped[p.genderName][p.categoryName].push(p);
    });

    const tree = Object.keys(grouped).map(
      (gender) => ({
        value: gender,
        label: gender,
        children: Object.keys(
          grouped[gender]
        ).map((category) => ({
          value: category,
          label: category,
          children: grouped[gender][
            category
          ].map((product: any) => ({
            value: product.productId,
            label: product.productCode,
          })),
        })),
      })
    );

    setProductTree(tree);
  };

  const loadUoms = async () => {
    const res = await api.get("/unit-of-measures");
    setUoms(res.data);
  };

  /* ------------------ Search Inbound ------------------ */
  const handleInboundSearch = async (
    value: string
  ) => {
    const res = await api.get(
      `/cites-inbounds?search=${value}`
    );

    if (!res.data.length) {
      message.error("Inbound not found");
      return;
    }

    setInbound(res.data[0]);
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = async () => {
    if (!inbound) {
      message.error("Select inbound first");
      return;
    }

    const values = await form.validateFields();

    const payload = {
      productId: values.productId,
      craftsmanId: values.craftsmanId,
      citesInboundId: inbound.citesInboundId,
      quantityUsed: values.quantityUsed,
      unitOfMeasureId: values.unitOfMeasureId,
      notes: values.notes,
    };

    await dispatch(createProduction(payload)).unwrap();

    message.success("Production started");

    form.resetFields();
    setInbound(null);
    setProductDetails(null);
    onClose();
  };

  return (
    <Modal
      title="Start Production"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      width={1000}
      destroyOnHidden
    >
      <Form layout="vertical" form={form}>
        {/* Inbound Search */}
        <Form.Item label="Search CITES Inbound">
          <Input.Search
            placeholder="Enter CITES Number"
            enterButton={<Button>Search</Button>}
            onSearch={handleInboundSearch}
          />
        </Form.Item>

        {inbound && (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Text strong>CITES:</Text>
                <br />
                {inbound.citesNumber}
              </Col>
              <Col span={8}>
                <Text strong>Scientific:</Text>
                <br />
                {inbound.scientificName}
              </Col>
              <Col span={8}>
                <Text strong>Available Qty:</Text>
                <br />
                {inbound.quantityReceived}
              </Col>
            </Row>
          </Card>
        )}

        <Divider />

        {/* Quantity + UOM + Craftsman */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Quantity Used"
              name="quantityUsed"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Unit Of Measure"
              name="unitOfMeasureId"
              rules={[{ required: true }]}
            >
              <Select
                options={uoms.map((u) => ({
                  value: u.unitOfMeasureId,
                  label: u.unitOfMeasureName,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Craftsman ID"
              name="craftsmanId"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Product Selection */}
        <Form.Item
          label="Product"
          name="productPath"
          rules={[{ required: true }]}
        >
          <Cascader
            options={productTree}
            placeholder="Select Product"
            onChange={async (value: any[]) => {
              const productId = value?.[2];
              if (!productId) return;

              form.setFieldsValue({
                productId,
              });

              const res = await api.get(
                `/products/${productId}`
              );
              setProductDetails(res.data);
            }}
          />
        </Form.Item>

        <Form.Item name="productId" hidden>
          <Input />
        </Form.Item>

        {/* Product Prices + Materials */}
        {productDetails && (
          <Card size="small" style={{ marginTop: 16 }}>
            <Text strong>
              Product Prices
            </Text>
            <br />
            Italy: {productDetails.priceItaly}
            <br />
            EU: {productDetails.priceEU}
            <br />
            Outside EU:{" "}
            {productDetails.priceOutsideEU}

            <Divider />

            {productDetails.materials?.length >
              0 && (
              <>
                <Text strong>
                  Materials Required
                </Text>

                <Table
                  size="small"
                  rowKey="productMaterialId"
                  pagination={false}
                  style={{ marginTop: 12 }}
                  columns={[
                    {
                      title: "Material",
                      dataIndex: "materialName",
                    },
                    {
                      title: "Qty",
                      dataIndex:
                        "quantityRequired",
                    },
                    {
                      title: "Unit",
                      dataIndex:
                        "unitOfMeasureName",
                    },
                    {
                      title: "Note",
                      dataIndex: "note",
                    },
                  ]}
                  dataSource={
                    productDetails.materials
                  }
                />
              </>
            )}
          </Card>
        )}

        <Divider />

        {/* Notes - REQUIRED */}
        <Form.Item
          label="Notes"
          name="notes"
          rules={[
            {
              required: true,
              message:
                "Notes is required",
            },
          ]}
        >
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}