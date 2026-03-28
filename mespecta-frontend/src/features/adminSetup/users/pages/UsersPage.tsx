import { useEffect, useRef, useState } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Popconfirm,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { fetchUsers, addUser, editUser, removeUser } from "../users.slice";
import type { UserFilter } from "../users.api";

const PAGE_SIZE = 10;

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items, totalCount, loading, mutating } = useAppSelector(
    (state) => state.users
  );

  const [filter, setFilter] = useState<UserFilter>({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  // Fetch whenever filter changes
  useEffect(() => {
    dispatch(fetchUsers(filter));
  }, [dispatch, filter]);

  // Debounced search — updates filter.search after 400 ms
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search: value || undefined, page: 1 }));
    }, 400);
  };

  // Role filter
  const handleRoleChange = (value: string | undefined) => {
    setFilter((prev) => ({ ...prev, role: value, page: 1 }));
  };

  // Pagination
  const handleTableChange = (pagination: any) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  /* ── Modal helpers ── */
  const openCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      role: record.role,
    });
    setModalOpen(true);
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        await dispatch(editUser({ id: editingRecord.userId, data: values })).unwrap();
        message.success("User updated successfully");
      } else {
        await dispatch(addUser(values)).unwrap();
        message.success("User created successfully");
      }

      setModalOpen(false);
      form.resetFields();
      dispatch(fetchUsers(filter)); // Refresh current page
    } catch (err: any) {
      if (typeof err === "string") message.error(err);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id: number) => {
    try {
      await dispatch(removeUser(id)).unwrap();
      message.success("User deleted");
      // If last item on page > 1, go back a page
      const newPage =
        items.length === 1 && (filter.page ?? 1) > 1
          ? (filter.page ?? 1) - 1
          : filter.page;
      setFilter((prev) => ({ ...prev, page: newPage }));
    } catch (err: any) {
      if (typeof err === "string") message.error(err);
    }
  };

  /* ── Columns ── */
  const columns = [
    { title: "Full Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
    {
      title: "",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <EditOutlined
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={() => openEdit(record)}
          />
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.userId)}>
            <DeleteOutlined style={{ color: "#ff4d4f", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      {/* HEADER */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Input
              placeholder="Search users..."
              allowClear
              style={{ width: 220 }}
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              onClear={() => handleSearchChange("")}
            />
            <Select
              placeholder="Filter by role"
              allowClear
              style={{ width: 160 }}
              onChange={handleRoleChange}
              options={[
                { value: "Admin", label: "Admin" },
                { value: "Craftsman", label: "Craftsman" },
              ]}
            />
          </Space>
        </Col>

        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add User
          </Button>
        </Col>
      </Row>

      {/* TABLE */}
      <Table
        rowKey="userId"
        columns={columns}
        dataSource={items}
        loading={loading || mutating}
        onChange={handleTableChange}
        pagination={{
          current: filter.page,
          pageSize: filter.pageSize,
          total: totalCount,
          hideOnSinglePage: true,
          showSizeChanger: false,
        }}
      />

      {/* MODAL */}
      <Modal
        title={editingRecord ? "Edit User" : "Create User"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingRecord ? "Update" : "Create"}
        confirmLoading={mutating}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {!editingRecord && (
            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "Admin", label: "Admin" },
                { value: "Craftsman", label: "Craftsman" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
