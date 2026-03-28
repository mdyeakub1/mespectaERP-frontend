import { useEffect, useState } from "react";
import {
  Table,
  Card,
  Input,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Select,
  Space,
} from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchSuppliers } from "../suppliers.slice";
import SupplierModal from "../components/SupplierModal";

export default function SuppliersPage() {
  const dispatch = useAppDispatch();
  const { items, totalCount, pageNumber, pageSize, loading } =
    useAppSelector((state) => state.suppliers);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [filterOpen, setFilterOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
const [editingRecord, setEditingRecord] = useState<any>(null);

  useEffect(() => {
    dispatch(
      fetchSuppliers({
        search,
        pageNumber,
        pageSize,
        ...filters,
      })
    );
  }, [dispatch, search, pageNumber, pageSize, filters]);

  const handleApplyFilter = (values: any) => {
    setFilters({
      country: values.country,
      isActive: values.isActive,
    });
    setFilterOpen(false);
  };

  const columns = [
    { title: "Name", dataIndex: "supplierName" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Country", dataIndex: "country" },
    {
  title: "",
  align: "right" as const,
  render: (_: any, record: any) => (
    <Button
      type="link"
      onClick={() => {
        setEditingRecord(record);
        setModalOpen(true);
      }}
    >
      Edit
    </Button>
  ),
}
  ];

  return (
    <Card>
      {/* TOP BAR */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 16 }}
      >
        <Col>
          <Space>
            <Input.Search
              placeholder="Search supplier..."
              allowClear
              enterButton={<Button>Search</Button>}
              style={{ width: 280 }}
              onSearch={(value) => setSearch(value)}
            />
          </Space>
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
  Add Supplier
</Button>
        </Col>
      </Row>

      <Table
        rowKey="supplierId"
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
          onChange: (page, size) => {
            dispatch(
              fetchSuppliers({
                search,
                pageNumber: page,
                pageSize: size,
                ...filters,
              })
            );
          },
        }}
      />

      <SupplierModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  initialData={editingRecord}
/>

      {/* FILTER MODAL */}
      <Modal
        title="Filter Suppliers"
        open={filterOpen}
        onCancel={() => setFilterOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleApplyFilter}>
          <Form.Item name="country" label="Country">
            <Input placeholder="Enter country" />
          </Form.Item>

          <Form.Item name="isActive" label="Active">
            <Select allowClear>
              <Select.Option value={true}>
                Active
              </Select.Option>
              <Select.Option value={false}>
                Inactive
              </Select.Option>
            </Select>
          </Form.Item>

          <Row justify="end">
            <Space>
              <Button onClick={() => setFilterOpen(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Apply Filter
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}