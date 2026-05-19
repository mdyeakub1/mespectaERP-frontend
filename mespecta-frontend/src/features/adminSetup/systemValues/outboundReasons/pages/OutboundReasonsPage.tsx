import { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  fetchOutboundReasons,
  addOutboundReason,
  editOutboundReason,
  removeOutboundReason,
} from "../outboundReasons.slice";

const { Title } = Typography;

const OutboundReasonsPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.outboundReasons);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [deletingRecord, setDeletingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchOutboundReasons());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const openDeleteModal = (record: any) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        await dispatch(
          editOutboundReason({
            id: editingRecord.outboundReasonId,
            data: values,
          })
        ).unwrap();
        message.success("Outbound reason updated successfully");
      } else {
        await dispatch(addOutboundReason(values)).unwrap();
        message.success("Outbound reason created successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // interceptor handles toast
    }
  };

  const handleDelete = async () => {
    if (!deletingRecord) return;

    try {
      await dispatch(removeOutboundReason(deletingRecord.outboundReasonId)).unwrap();
      message.success("Outbound reason deleted successfully");
      setIsDeleteModalOpen(false);
    } catch {
      // interceptor handles toast
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <EditOutlined
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={() => openEditModal(record)}
          />
          <DeleteOutlined
            style={{ color: "#ff4d4f", cursor: "pointer" }}
            onClick={() => openDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          Outbound Reasons
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          style={{ marginBottom: 16 }}
        >
          Add New
        </Button>
      </Space>

      <Table
        rowKey="outboundReasonId"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered={false}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRecord ? "Edit Outbound Reason" : "Add Outbound Reason"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to delete{" "}
        <strong>{deletingRecord?.name}</strong>?
      </Modal>
    </div>
  );
};

export default OutboundReasonsPage;
