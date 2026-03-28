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
  fetchSources,
  addSource,
  editSource,
  removeSource,
} from "../sources.slice";

const { Title } = Typography;

const SourcesPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(
    (state) => state.sources
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [deletingRecord, setDeletingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchSources());
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
          editSource({
            id: editingRecord.sourceId,
            data: values,
          })
        ).unwrap();
        message.success("Source updated successfully");
      } else {
        await dispatch(addSource(values)).unwrap();
        message.success("Source created successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!deletingRecord) return;

    try {
      await dispatch(
        removeSource(deletingRecord.sourceId)
      ).unwrap();

      message.success("Source deleted successfully");
      setIsDeleteModalOpen(false);
    } catch {
      message.error("Failed to delete source");
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
        <Space style={{width: "100%", justifyContent:"space-between"}}>
<Title level={5} style={{ marginBottom: 16 }}>
        Sources
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
        rowKey="sourceId"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered={false}
        pagination={{ pageSize: 10 }}
      />

      {/* Create / Edit Modal */}
      <Modal
        title={editingRecord ? "Edit Source" : "Add Source"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter source name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{deletingRecord?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default SourcesPage;