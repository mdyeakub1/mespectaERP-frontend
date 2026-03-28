import { Modal, Form, Input, Row, Col, Typography } from "antd";
import { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { addCustomer, editCustomer } from "../customers.slice";

const { Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: any;
}

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ margin: "12px 0 8px" }}>
    <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#1677ff" }}>
      {children}
    </Text>
    <div style={{ height: 1, background: "#e8f0fe", marginTop: 3 }} />
  </div>
);

const AddressBlock = ({ prefix }: { prefix: 0 | 1 }) => (
  <>
    <Form.Item name={["addresses", prefix, "addressType"]} noStyle>
      <Input type="hidden" />
    </Form.Item>
    <Row gutter={12}>
      <Col span={24}>
        <Form.Item label="Address Line" name={["addresses", prefix, "addressLine"]} style={{ marginBottom: 8 }}>
          <Input placeholder="Street / building" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="City" name={["addresses", prefix, "city"]} style={{ marginBottom: 0 }}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="State" name={["addresses", prefix, "state"]} style={{ marginBottom: 0 }}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="Postal Code" name={["addresses", prefix, "postalCode"]} style={{ marginBottom: 0 }}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="Country" name={["addresses", prefix, "country"]} style={{ marginBottom: 0 }}>
          <Input />
        </Form.Item>
      </Col>
    </Row>
  </>
);

export default function CustomerModal({ open, onClose, initialData }: Props) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialData) {
      const addresses = [
        initialData.addresses?.find((a: any) => a.addressType?.toLowerCase() === "shipping") ?? { addressType: "shipping" },
        initialData.addresses?.find((a: any) => a.addressType?.toLowerCase() === "billing") ?? { addressType: "billing" },
      ];
      form.setFieldsValue({ ...initialData, addresses });
    } else {
      form.resetFields();
      form.setFieldsValue({
        addresses: [
          { addressType: "shipping" },
          { addressType: "billing" },
        ],
      });
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (initialData) {
      await dispatch(editCustomer({ id: initialData.customerId, data: values })).unwrap();
    } else {
      await dispatch(addCustomer(values)).unwrap();
    }
    onClose();
  };

  return (
    <Modal
      title={initialData ? "Edit Customer" : "Add New Customer"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      width={680}
      destroyOnClose
    >
      <Form layout="vertical" form={form} size="middle">

        <SectionLabel>Basic Information</SectionLabel>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item label="Customer Name" name="customerName" rules={[{ required: true }]} style={{ marginBottom: 8 }}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ type: "email" }]} style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone" name="phone" style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <SectionLabel>Shipping Address</SectionLabel>
        <AddressBlock prefix={0} />

        <SectionLabel>Billing Address</SectionLabel>
        <AddressBlock prefix={1} />

      </Form>
    </Modal>
  );
}
