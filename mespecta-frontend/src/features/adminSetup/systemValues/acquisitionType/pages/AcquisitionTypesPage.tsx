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
  fetchAcquisitionTypes,
  addAcquisitionType,
  editAcquisitionType,
  removeAcquisitionType,
} from "../acquisitionTypes.slice";

const { Title } = Typography;

const AcquisitionTypesPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(
    (state) => state.acquisitionTypes
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [deletingRecord, setDeletingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAcquisitionTypes());
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
          editAcquisitionType({
            id: editingRecord.acquisitionTypeId,
            data: values,
          })
        ).unwrap();
        message.success("Acquisition Type updated successfully");
      } else {
        await dispatch(addAcquisitionType(values)).unwrap();
        message.success("Acquisition Type created successfully");
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
      await dispatch(
        removeAcquisitionType(deletingRecord.acquisitionTypeId)
      ).unwrap();

      message.success("Acquisition Type deleted successfully");
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
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            style={{ color: "#1677ff" }}
            onClick={() => openEditModal(record)}
          />

          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
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
        Acquisition Types
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
        rowKey="acquisitionTypeId"
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
            ? "Edit Acquisition Type"
            : "Add Acquisition Type"
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
            rules={[{ required: true, message: "Name is required" }]}
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

export default AcquisitionTypesPage;