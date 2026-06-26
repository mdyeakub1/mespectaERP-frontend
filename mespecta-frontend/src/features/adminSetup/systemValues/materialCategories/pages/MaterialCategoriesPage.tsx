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
  fetchMaterialCategories,
  addMaterialCategory,
  editMaterialCategory,
  removeMaterialCategory,
} from "../materialCategories.slice";

const { Title } = Typography;

const MaterialCategoriesPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(
    (state) => state.materialCategories
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [deletingRecord, setDeletingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchMaterialCategories());
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
          editMaterialCategory({
            id: editingRecord.materialCategoryId,
            data: values,
          })
        ).unwrap();
        message.success("Material Category updated successfully");
      } else {
        await dispatch(addMaterialCategory(values)).unwrap();
        message.success("Material Category created successfully");
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
        removeMaterialCategory(deletingRecord.materialCategoryId)
      ).unwrap();

      message.success("Material Category deleted successfully");
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
        Material Categories
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
        rowKey="materialCategoryId"
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
            ? "Edit Material Category"
            : "Add Material Category"
        }
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
            <Input placeholder="Enter category name" />
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

export default MaterialCategoriesPage;