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
  fetchDocumentTypes,
  addDocumentType,
  editDocumentType,
  removeDocumentType,
} from "../documentTypes.slice";

const { Title } = Typography;

const DocumentTypesPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(
    (state) => state.documentTypes
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [deletingRecord, setDeletingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchDocumentTypes());
  }, [dispatch]);

  // Open Create
  const openCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open Edit
  const openEditModal = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (record: any) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  // Create / Edit Submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        await dispatch(
          editDocumentType({
            id: editingRecord.documentTypeId,
            data: values,
          })
        ).unwrap();

        message.success("Document Type updated successfully");
      } else {
        await dispatch(addDocumentType(values)).unwrap();
        message.success("Document Type created successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Operation failed");
    }
  };

  // Confirm Delete
  const handleDelete = async () => {
    if (!deletingRecord) return;

    try {
      await dispatch(
        removeDocumentType(deletingRecord.documentTypeId)
      ).unwrap();

      message.success("Document Type deleted successfully");
      setIsDeleteModalOpen(false);
    } catch {
      message.error("Failed to delete document type");
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
        Document Types
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
        rowKey="documentTypeId"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered={false}
        pagination={{ pageSize: 10 }}
      />

      {/* Create / Edit Modal */}
      <Modal
        title={
          editingRecord
            ? "Edit Document Type"
            : "Add Document Type"
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Name is required" },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
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

export default DocumentTypesPage;