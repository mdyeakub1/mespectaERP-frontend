import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Select,
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchMaterials,
  addMaterial,
  editMaterial,
  removeMaterial,
} from "../materials.slice";
import {
  fetchMaterialCategories,
} from "../../adminSetup/systemValues/materialCategories/materialCategories.slice";

const MaterialsPage = () => {
  const dispatch = useAppDispatch();

  const { data, totalCount, loading } =
    useAppSelector((state) => state.materials);

  const { data: categories } = useAppSelector(
    (state) => state.materialCategories
  );

  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState<any>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);
  const [editingRecord, setEditingRecord] =
    useState<any>(null);
  const [deletingRecord, setDeletingRecord] =
    useState<any>(null);

  const [form] = Form.useForm();

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(
      fetchMaterials({
        search: searchText,
        pageNumber,
        pageSize,
        ...filters,
      })
    );

    dispatch(fetchMaterialCategories());
  }, [dispatch, searchText, pageNumber, pageSize, filters]);

  /* ================= CREATE ================= */
  const openCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  /* ================= EDIT ================= */
  const openEditModal = (record: any) => {
    const category = categories.find(
      (c) => c.name === record.categoryName
    );

    setEditingRecord(record);

    form.setFieldsValue({
      materialName: record.materialName,
      materialCategoryId:
        category?.materialCategoryId,
      note: record.note,
    });

    setIsModalOpen(true);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        await dispatch(
          editMaterial({
            id: editingRecord.materialId,
            data: values,
          })
        ).unwrap();

        message.success(
          "Material updated successfully"
        );
      } else {
        await dispatch(addMaterial(values)).unwrap();
        message.success(
          "Material created successfully"
        );
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error || "Operation failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await dispatch(
        removeMaterial(deletingRecord.materialId)
      ).unwrap();

      message.success(
        "Material deleted successfully"
      );
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      message.error(error || "Delete failed");
    }
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      title: "Name",
      dataIndex: "materialName",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
    },
    {
      title: "Note",
      dataIndex: "note",
    },
    {
      title: "",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <EditOutlined
            style={{
              color: "#1677ff",
              cursor: "pointer",
            }}
            onClick={() =>
              openEditModal(record)
            }
          />
          <DeleteOutlined
            style={{
              color: "#ff4d4f",
              cursor: "pointer",
            }}
            onClick={() => {
              setDeletingRecord(record);
              setIsDeleteModalOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      {/* ================= TOP BAR ================= */}
      <Row
        justify="space-between"
        style={{ marginBottom: 16 }}
      >
        <Col>
          <Space>
            <Input.Search
              placeholder="Search material..."
              style={{ width: 250 }}
              allowClear
              enterButton={<Button>Search</Button>}
              onSearch={(value) => {
                setPageNumber(1);
                setSearchText(value);
              }}
            />

            <Select
              placeholder="Category"
              allowClear
              style={{ width: 180 }}
              onChange={(value) => {
                setPageNumber(1);
                setFilters((prev: any) => ({
                  ...prev,
                  categoryId: value,
                }));
              }}
            >
              {categories.map((cat) => (
                <Select.Option
                  key={cat.materialCategoryId}
                  value={
                    cat.materialCategoryId
                  }
                >
                  {cat.name}
                </Select.Option>
              ))}
            </Select>

          </Space>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Add New
          </Button>
        </Col>
      </Row>

      {/* ================= TABLE ================= */}
      <Table
        rowKey="materialId"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pageNumber,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          hideOnSinglePage: true,
          pageSizeOptions: [
            "10",
            "20",
            "50",
          ],
          showTotal: (
            total,
            range
          ) =>
            `${range[0]}-${range[1]} of ${total} records`,
          onChange: (page, size) => {
            setPageNumber(page);
            setPageSize(size);
          },
        }}
      />

      {/* ================= CREATE / EDIT MODAL ================= */}
      <Modal
        title={
          editingRecord
            ? "Edit Material"
            : "Add Material"
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() =>
          setIsModalOpen(false)
        }
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Material Name"
            name="materialName"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="materialCategoryId"
            rules={[
              {
                required: true,
                message:
                  "Category is required",
              },
            ]}
          >
            <Select placeholder="Select category">
              {categories.map((cat) => (
                <Select.Option
                  key={
                    cat.materialCategoryId
                  }
                  value={
                    cat.materialCategoryId
                  }
                >
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Note" name="note">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= DELETE MODAL ================= */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() =>
          setIsDeleteModalOpen(false)
        }
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to delete{" "}
        <strong>
          {deletingRecord?.materialName}
        </strong>
        ?
      </Modal>
    </Card>
  );
};

export default MaterialsPage;