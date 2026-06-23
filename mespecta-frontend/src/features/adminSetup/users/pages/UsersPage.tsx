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
  Row,
  Col,
  Tag,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, CopyOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { fetchUsers, addUser, editUser, removeUser, resetPassword } from "../users.slice";
import type { UserFilter } from "../users.api";

const { Text } = Typography;

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
  const [sortBy, setSortBy]               = useState<string | undefined>(undefined);
  const [sortDescending, setSortDescending] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<any>(null);

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetTargetRecord, setResetTargetRecord] = useState<any>(null);
  const [resetResultOpen, setResetResultOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const [form] = Form.useForm();

  // Fetch whenever filter or sort changes
  useEffect(() => {
    dispatch(fetchUsers({ ...filter, sortBy, sortDescending: sortBy ? sortDescending : undefined }));
  }, [dispatch, filter, sortBy, sortDescending]);

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
    } catch {
      // interceptor handles toast
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deletingRecord) return;
    try {
      await dispatch(removeUser(deletingRecord.userId)).unwrap();
      message.success("User deleted");
      setDeleteModalOpen(false);
      setDeletingRecord(null);
      // If last item on page > 1, go back a page
      const newPage =
        items.length === 1 && (filter.page ?? 1) > 1
          ? (filter.page ?? 1) - 1
          : filter.page;
      setFilter((prev) => ({ ...prev, page: newPage }));
    } catch {
      // interceptor handles toast
    }
  };

  /* ── Reset Password ── */
  const handleResetPassword = async () => {
    if (!resetTargetRecord) return;
    try {
      const result = await dispatch(resetPassword(resetTargetRecord.userId)).unwrap();
      const newPassword = result?.data?.newPassword ?? result?.data?.NewPassword;
      setResetConfirmOpen(false);
      setTempPassword(newPassword);
      setResetResultOpen(true);
      dispatch(fetchUsers(filter)); // Refresh so "Reset pending" badge shows
    } catch {
      // interceptor handles toast
    }
  };

  const handleCopyPassword = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    message.success("Password copied to clipboard");
  };

  /* ── Columns ── */
  const columns = [
    { title: "Full Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Status",
      render: (_: any, record: any) =>
        record.mustChangePassword ? <Tag color="orange">Reset pending</Tag> : null,
    },
    {
      title: "",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <KeyOutlined
            style={{ color: "#fa8c16", cursor: "pointer" }}
            title="Reset Password"
            onClick={() => { setResetTargetRecord(record); setResetConfirmOpen(true); }}
          />

          <EditOutlined
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={() => openEdit(record)}
          />
          <DeleteOutlined
            style={{ color: "#ff4d4f", cursor: "pointer" }}
            onClick={() => { setDeletingRecord(record); setDeleteModalOpen(true); }}
          />
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
            <Select
              placeholder="Sort By"
              allowClear
              style={{ width: 150 }}
              value={sortBy}
              onChange={(val) => { setSortBy(val); setFilter((p) => ({ ...p, page: 1 })); }}
              options={[
                { value: "FullName",  label: "Full Name" },
                { value: "Email",     label: "Email" },
                { value: "Role",      label: "Role" },
                { value: "IsActive",  label: "Active" },
                { value: "CreatedAt", label: "Created At" },
              ]}
            />
            {sortBy && (
              <Select
                style={{ width: 130 }}
                value={sortDescending}
                onChange={setSortDescending}
                options={[
                  { value: true,  label: "Descending" },
                  { value: false, label: "Ascending" },
                ]}
              />
            )}
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
        destroyOnHidden
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

      {/* DELETE CONFIRM MODAL */}
      <Modal
        title="Delete User"
        open={deleteModalOpen}
        onOk={handleDelete}
        onCancel={() => { setDeleteModalOpen(false); setDeletingRecord(null); }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={mutating}
        destroyOnHidden
      >
        Are you sure you want to delete{" "}
        <strong>{deletingRecord?.fullName}</strong>? This action cannot be undone.
      </Modal>

      {/* RESET PASSWORD CONFIRM MODAL */}
      <Modal
        title="Reset Password"
        open={resetConfirmOpen}
        onOk={handleResetPassword}
        onCancel={() => { setResetConfirmOpen(false); setResetTargetRecord(null); }}
        okText="Reset Password"
        okButtonProps={{ danger: true }}
        confirmLoading={mutating}
        destroyOnHidden
      >
        Are you sure you want to reset the password for{" "}
        <strong>{resetTargetRecord?.fullName}</strong>? They will be required to set a new password on next login.
      </Modal>

      {/* RESET PASSWORD RESULT MODAL */}
      <Modal
        title="Temporary Password"
        open={resetResultOpen}
        onCancel={() => { setResetResultOpen(false); setTempPassword(null); }}
        footer={[
          <Button key="close" onClick={() => { setResetResultOpen(false); setTempPassword(null); }}>
            Close
          </Button>,
        ]}
        destroyOnHidden
      >
        <Text>Share this temporary password with the user. It will not be shown again.</Text>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f5f5f5",
            borderRadius: 8,
            padding: "10px 14px",
          }}
        >
          <Text strong style={{ fontSize: 16, letterSpacing: 1 }}>{tempPassword}</Text>
          <Button icon={<CopyOutlined />} onClick={handleCopyPassword}>
            Copy
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
