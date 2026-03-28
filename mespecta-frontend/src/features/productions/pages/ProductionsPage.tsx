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
  message,
} from "antd";
import {
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchProductions } from "../productions.slice";
import StartProductionModal from "../components/StartProductionModal";
import api from "../../../services/api";

const { RangePicker } = DatePicker;

const ProductionStatusMap: Record<
  number,
  { label: string; color: string }
> = {
  1: { label: "In Progress", color: "processing" },
  2: { label: "Paused", color: "warning" },
  3: { label: "Completed", color: "success" },
};

export default function ProductionsPage() {
  const dispatch = useAppDispatch();
  const { data, loading, totalCount } =
    useAppSelector((state) => state.productions);

    

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<any>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);

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
      })
    );
  }, [
    dispatch,
    searchTerm,
    pageNumber,
    pageSize,
    filters,
  ]);

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
      message.error("Failed to load filter data");
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
  };

  const isFilterActive = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== ""
  );

  const handleResetFilter = () => {
    setFilters({});
    setPageNumber(1);
  };

  const columns = [
    { title: "Production Code", dataIndex: "productionCode" },
    { title: "Product", dataIndex: "productCode" },
    { title: "Craftsman", dataIndex: "craftsmanName" },
    { title: "CITES Number", dataIndex: "citesNumber" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) => {
        const config = ProductionStatusMap[status];
        return config ? (
          <Tag color={config.color}>
            {config.label}
          </Tag>
        ) : (
          <Tag>Unknown</Tag>
        );
      },
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
      render: (val: number) =>
        `${val || 0} hrs`,
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
          </Row>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setStartOpen(true)}
            disabled
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
        <Form layout="vertical" onFinish={handleApplyFilter}>
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

      {/* ================= START MODAL ================= */}
      <StartProductionModal
        open={startOpen}
        onClose={() => setStartOpen(false)}
      />
    </Card>
  );
}