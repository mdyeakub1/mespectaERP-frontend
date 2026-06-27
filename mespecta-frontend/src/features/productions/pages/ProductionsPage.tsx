import { useEffect, useState } from "react";
import {
  Table,
  Card,
  Input,
  Row,
  Col,
  Tag,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  FilterOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchProductions } from "../productions.slice";
import { getProductionDetails } from "../productions.api";
import ProductionFormModal from "../components/ProductionFormModal";
import api from "../../../services/api";
import { formatHours } from "../../../utils/formatHours";

const { RangePicker } = DatePicker;

const getStatusTag = (status: number | string) => {
  switch (status) {
    case 1:
    case "InProgress":
    case "In Progress":
      return <Tag color="processing">In Progress</Tag>;
    case 2:
    case "Paused":
      return <Tag color="warning">Paused</Tag>;
    case 3:
    case "Completed":
      return <Tag color="success">Completed</Tag>;
    default:
      return <Tag>{String(status)}</Tag>;
  }
};

export default function ProductionsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, loading, totalCount } =
    useAppSelector((state) => state.productions);

    

  const [filterForm] = Form.useForm();
  const [searchTerm, setSearchTerm]           = useState("");
  const [pageNumber, setPageNumber]           = useState(1);
  const [pageSize, setPageSize]               = useState(10);
  const [filters, setFilters]                 = useState<any>({});
  const [filterOpen, setFilterOpen]           = useState(false);
  const [startOpen, setStartOpen]             = useState(false);
  const [editingProduction, setEditingProduction] = useState<any>(null);
  const [sortBy, setSortBy]                   = useState<string | undefined>(undefined);
  const [sortDescending, setSortDescending]   = useState(true);

  const [products, setProducts] = useState<any[]>([]);
  const [craftsmen, setCraftsmen] = useState<any[]>([]);
  const [loadingFilters, setLoadingFilters] =
    useState(false);

  // ================= FETCH PRODUCTIONS =================
  useEffect(() => {
    dispatch(
      fetchProductions({
        searchTerm,
        pageNumber,
        pageSize,
        ...filters,
        ...(sortBy ? { sortBy, sortDescending } : {}),
      })
    );
  }, [dispatch, searchTerm, pageNumber, pageSize, filters, sortBy, sortDescending]);

  // ================= LOAD FILTER DROPDOWNS =================
  const loadFilterDropdowns = async () => {
    try {
      setLoadingFilters(true);

      const [productRes, craftsmanRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/craftsmen"),
        ]);

      const extract = (res: any) => {
        if (Array.isArray(res.data?.data))
          return res.data.data;

        if (res.data?.data?.items)
          return res.data.data.items;

        return [];
      };

      setProducts(extract(productRes));
      setCraftsmen(extract(craftsmanRes));
    } catch {
      // interceptor handles toast
    } finally {
      setLoadingFilters(false);
    }
  };

  useEffect(() => {
    if (filterOpen) {
      loadFilterDropdowns();
    }
  }, [filterOpen]);

  // ================= SEARCH =================
  const handleSearch = (value: string) => {
    setPageNumber(1);
    setSearchTerm(value);
  };

  // ================= APPLY FILTER =================
  const handleApplyFilter = (values: any) => {
    setPageNumber(1);

    setFilters({
      status: values.status,
      productId: values.productId,
      userId: values.userId,
      createdFrom: values.dateRange
        ? values.dateRange[0].toISOString()
        : undefined,
      createdTo: values.dateRange
        ? values.dateRange[1].toISOString()
        : undefined,
    });

    setFilterOpen(false);
    filterForm.resetFields();
  };

  const isFilterActive = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== ""
  );

  const handleResetFilter = () => {
    setFilters({});
    setPageNumber(1);
  };

  const refetch = () => {
    dispatch(
      fetchProductions({
        searchTerm,
        pageNumber,
        pageSize,
        ...filters,
        ...(sortBy ? { sortBy, sortDescending } : {}),
      })
    );
  };

  const openEdit = async (record: any) => {
    try {
      const details = await getProductionDetails(record.productionId);
      setEditingProduction(details);
    } catch {
      // interceptor handles toast
    }
  };

  const columns = [
    { title: "Outbound Serial No.", dataIndex: "outboundSerialNumber" },
    { title: "Product", dataIndex: "productCode" },
    { title: "Craftsman", dataIndex: "craftsmanName" },
    { title: "CITES Number", dataIndex: "citesNumber" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number | string) => getStatusTag(status),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (val: string) =>
        new Date(val).toLocaleDateString(),
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      render: (val: string | null) =>
        val ? new Date(val).toLocaleDateString() : "-",
    },
    {
      title: "Working Hours",
      dataIndex: "totalWorkingHours",
      render: (val: number) => formatHours(val),
    },
    {
      title: "",
      align: "right" as const,
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/productions/${record.productionId}`)}
          >
            Details
          </Button>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            style={{ color: "#1677ff" }}
            onClick={() => openEdit(record)}
          />
        </>
      ),
    },
  ];

  return (
    <Card>
      {/* ================= TOP BAR ================= */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 20 }}
      >
        <Col>
          <Row gutter={8}>
            <Col>
              <Input.Search
                placeholder="Search Production"
                style={{ width: 280 }}
                allowClear
                enterButton={<Button>Search</Button>}
                onSearch={handleSearch}
              />
            </Col>

            <Col>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilterOpen(true)}
              >
                Filter
              </Button>
            </Col>

            {isFilterActive && (
              <Col>
                <Button danger onClick={handleResetFilter}>
                  Reset Filter
                </Button>
              </Col>
            )}

            <Col>
              <Select
                placeholder="Sort By"
                allowClear
                style={{ width: 170 }}
                value={sortBy}
                onChange={(val) => { setSortBy(val); setPageNumber(1); }}
                options={[
                  { value: "SerialNo",           label: "Serial No." },
                  { value: "CreatedAt",          label: "Created At" },
                  { value: "CompletedAt",        label: "Completed At" },
                  { value: "Status",             label: "Status" },
                  { value: "ProductionType",     label: "Type" },
                  { value: "TotalWorkingHours",  label: "Working Hours" },
                  { value: "CustomerName",       label: "Customer" },
                ]}
              />
            </Col>
            {sortBy && (
              <Col>
                <Select
                  style={{ width: 130 }}
                  value={sortDescending}
                  onChange={setSortDescending}
                  options={[
                    { value: true,  label: "Descending" },
                    { value: false, label: "Ascending" },
                  ]}
                />
              </Col>
            )}
          </Row>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setStartOpen(true)}
          >
            Start Production
          </Button>
        </Col>
      </Row>

      {/* ================= TABLE ================= */}
      <Table
        rowKey="productionId"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pageNumber,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          hideOnSinglePage: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} records`,
          onChange: (page, size) => {
            setPageNumber(page);
            setPageSize(size);
          },
        }}
      />

      {/* ================= FILTER MODAL ================= */}
      <Modal
        title="Filter Productions"
        open={filterOpen}
        onCancel={() => setFilterOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={filterForm} onFinish={handleApplyFilter}>
          <Form.Item name="status" label="Status">
            <Select allowClear>
              <Select.Option value={1}>
                In Progress
              </Select.Option>
              <Select.Option value={2}>
                Paused
              </Select.Option>
              <Select.Option value={3}>
                Completed
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="productId" label="Product">
            <Select
              allowClear
              loading={loadingFilters}
              options={products.map((p) => ({
                value: p.productId ?? p.id,
                label:
                  p.productCode ?? p.name,
              }))}
            />
          </Form.Item>

          <Form.Item name="userId" label="Craftsman">
           <Select 
              allowClear
              loading={loadingFilters}
              options={craftsmen.map((c) => ({
                value: Number(c.userId), 
                label: c.fullName,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Created Date"
          >
            <RangePicker
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Row justify="end" gutter={8}>
            <Col>
              <Button
                onClick={() =>
                  setFilterOpen(false)
                }
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
              >
                Apply Filter
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* ================= START / EDIT MODAL ================= */}
      <ProductionFormModal
        open={startOpen}
        onClose={() => setStartOpen(false)}
        onSuccess={refetch}
      />

      <ProductionFormModal
        open={Boolean(editingProduction)}
        initialData={editingProduction}
        onClose={() => setEditingProduction(null)}
        onSuccess={refetch}
      />
    </Card>
  );
}