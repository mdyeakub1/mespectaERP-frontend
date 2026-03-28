import { Modal, Form, Input, Row, Col, message } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import {
  addSupplier,
  editSupplier,
  fetchSuppliers,
} from "../suppliers.slice";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: any;
}

export default function SupplierModal({
  open,
  onClose,
  initialData,
}: Props) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (initialData) {
        await dispatch(
          editSupplier({
            id: initialData.supplierId,
            data: values,
          })
        ).unwrap();

        message.success("Supplier updated successfully");
      } else {
        await dispatch(addSupplier(values)).unwrap();

        message.success("Supplier created successfully");
      }

      dispatch(fetchSuppliers({}));

      onClose();
    } catch (error: any) {
      message.error(error || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={initialData ? "Edit Supplier" : "Add Supplier"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      width={600}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Supplier Name"
              name="supplierName"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Email is required" }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phone" name="phone"
            rules={[{ required: true, message: "Phone is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Address" name="address" rules={[{ required: true, message: "Address is required" }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Country" name="country" rules={[{ required: true, message: "country is required" }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}