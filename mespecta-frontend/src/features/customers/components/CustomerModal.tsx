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

export default function CustomerModal({ open, onClose, initialData }: Props) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        customerName: initialData.customerName,
        email: initialData.email,
        phone: initialData.phone,
        shippingAddress: initialData.shippingAddress ?? "",
        billingAddress: initialData.billingAddress ?? "",
      });
    } else {
      form.resetFields();
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload = {
      customerName: values.customerName,
      email: values.email,
      phone: values.phone,
      shippingAddress: values.shippingAddress ?? "",
      billingAddress: values.billingAddress ?? "",
    };

    if (initialData) {
      await dispatch(editCustomer({ id: initialData.customerId, data: payload })).unwrap();
    } else {
      await dispatch(addCustomer(payload)).unwrap();
    }
    onClose();
  };

  return (
    <Modal
      title={initialData ? "Edit Customer" : "Add New Customer"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      width={560}
      destroyOnHidden
    >
      <Form layout="vertical" form={form} style={{ marginTop: 8 }}>

        <SectionLabel>Basic Information</SectionLabel>
        <Form.Item label="Customer Name" name="customerName" rules={[{ required: true }]} style={{ marginBottom: 8 }}>
          <Input />
        </Form.Item>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ type: "email" }]} style={{ marginBottom: 8 }}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone" name="phone" style={{ marginBottom: 8 }}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <SectionLabel>Shipping Address</SectionLabel>
        <Form.Item name="shippingAddress" style={{ marginBottom: 0 }}>
          <Input.TextArea rows={2} placeholder="Enter shipping address" />
        </Form.Item>

        <SectionLabel>Billing Address</SectionLabel>
        <Form.Item name="billingAddress" style={{ marginBottom: 0 }}>
          <Input.TextArea rows={2} placeholder="Enter billing address" />
        </Form.Item>

      </Form>
    </Modal>
  );
}
