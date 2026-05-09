import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Card,
  Modal,
  Input,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchCustomers,
  removeCustomer,
} from "../customers.slice";
import CustomerModal from "../components/CustomerModal";

export default function CustomersPage() {
  const dispatch = useAppDispatch();

  const {
    items,
    totalCount,
    pageNumber,
    pageSize,
    loading,
  } = useAppSelector((state) => state.customers);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<any>(null);

  const [searchText] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(
      fetchCustomers({
        search: searchText,
        pageNumber,
        pageSize,
      })
    );
  }, [dispatch, searchText, pageNumber, pageSize]);

  const columns = [
    { title: "Name", dataIndex: "customerName" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },

    /* ===== Addresses Column ===== */
    {
      title: "Addresses",
      render: (_: any, record: any) => (
        <div style={{ fontSize: 13 }}>
          {record.shippingAddress && (
            <div><strong>Shipping:</strong> {record.shippingAddress}</div>
          )}
          {record.billingAddress && (
            <div style={{ marginTop: record.shippingAddress ? 4 : 0 }}>
              <strong>Billing:</strong> {record.billingAddress}
            </div>
          )}
          {!record.shippingAddress && !record.billingAddress && (
            <span style={{ color: "#999" }}>No address</span>
          )}
        </div>
      ),
    },

    /* ===== Edit / Delete ===== */
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
            onClick={() => {
              setEditingRecord(record);
              setModalOpen(true);
            }}
          />

          <DeleteOutlined
            style={{
              color: "#ff4d4f",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedRecord(record);
              setDeleteModalOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      {/* ===== TOP BAR ===== */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 20 }}
      >
        <Col>
          <Input.Search
            placeholder="Search customer"
            style={{ width: 260 }}
            allowClear
            enterButton={<Button>Search</Button>}
            onSearch={(value) => {
              dispatch(
                fetchCustomers({
                  search: value,
                  pageNumber: 1,
                  pageSize,
                })
              );
            }}
          />
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRecord(null);
              setModalOpen(true);
            }}
          >
            Add New Customer
          </Button>
        </Col>
      </Row>

      {/* ===== TABLE ===== */}
      <Table
        rowKey="customerId"
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={{
          current: pageNumber,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          hideOnSinglePage: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} records`,
          onChange: (page, size) => {
            dispatch(
              fetchCustomers({
                search: searchText,
                pageNumber: page,
                pageSize: size,
              })
            );
          },
        }}
      />

      {/* ===== CUSTOMER MODAL ===== */}
      <CustomerModal
        open={modalOpen}
        initialData={editingRecord}
        onClose={() => setModalOpen(false)}
      />

      {/* ===== DELETE MODAL ===== */}
      <Modal
        title="Confirm Delete"
        open={deleteModalOpen}
        onOk={async () => {
          try {
            await dispatch(
              removeCustomer(
                selectedRecord.customerId
              )
            ).unwrap();

            message.success(
              "Customer deleted successfully"
            );

            dispatch(fetchCustomers({}));

            setDeleteModalOpen(false);
          } catch (error: any) {
            message.error(error);
          }
        }}
        onCancel={() =>
          setDeleteModalOpen(false)
        }
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to delete{" "}
        <strong>
          {selectedRecord?.customerName}
        </strong>
        ?
      </Modal>
    </Card>
  );
}