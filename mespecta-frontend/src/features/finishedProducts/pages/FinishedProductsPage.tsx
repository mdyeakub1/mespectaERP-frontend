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
  Space,
  Segmented,
} from "antd";
import { FilterOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchFinishedProducts } from "../finishedProducts.slice";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const { RangePicker } = DatePicker;

type ViewMode = "production" | "stock";

export default function FinishedProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, totalCount, loading } = useAppSelector((state) => state.finishedProducts);

  // ── View mode ──────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>("production");

  // ── Production view state ──────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<any>({});
  const [filterOpen, setFilterOpen] = useState(false);

  // ── Stock view state ────────────────────────────────────────
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [stockLoading, setStockLoading] = useState(false);

  // ── Filter dropdown data ────────────────────────────────────
  const [products, setProducts] = useState<any[]>([]);
  const [productions, setProductions] = useState<any[]>([]);
  const [citesList, setCitesList] = useState<any[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // ── Fetch production list ───────────────────────────────────
  useEffect(() => {
    if (viewMode === "production") {
      dispatch(fetchFinishedProducts({ searchTerm, pageNumber, pageSize, ...filters }));
    }
  }, [dispatch, viewMode, searchTerm, pageNumber, pageSize, filters]);

  // ── Fetch stock list ────────────────────────────────────────
  useEffect(() => {
    if (viewMode === "stock") {
      setStockLoading(true);
      api
        .get("/finished-products/stock")
        .then((res) => setStockItems(res.data?.data ?? []))
        .catch(() => message.error("Failed to load stock data"))
        .finally(() => setStockLoading(false));
    }
  }, [viewMode]);

  // ── Filter dropdowns ────────────────────────────────────────
  const loadDropdowns = async () => {
    try {
      setLoadingFilters(true);
      const [pRes, prRes, cRes] = await Promise.all([
        api.get("/products"),
        api.get("/productions"),
        api.get("/cites-inbounds"),
      ]);
      const extract = (res: any) => res.data?.data?.items ?? res.data?.data ?? [];
      setProducts(extract(pRes));
      setProductions(extract(prRes));
      setCitesList(extract(cRes));
    } catch {
      message.error("Failed to load filter data");
    } finally {
      setLoadingFilters(false);
    }
  };

  useEffect(() => {
    if (filterOpen) loadDropdowns();
  }, [filterOpen]);

  const handleApplyFilter = (values: any) => {
    setPageNumber(1);
    setFilters({
      isSold: values.isSold,
      productId: values.productId,
      productionId: values.productionId,
      citesInboundId: values.citesInboundId,
      createdFrom: values.dateRange ? values.dateRange[0].toISOString() : undefined,
      createdTo: values.dateRange ? values.dateRange[1].toISOString() : undefined,
    });
    setFilterOpen(false);
  };

  const isFilterActive = Object.values(filters).some(
    (v) => v !== undefined && v !== null && v !== ""
  );

  const handleResetFilter = () => {
    setFilters({});
    setPageNumber(1);
  };

  // ── Production columns ──────────────────────────────────────
  const productionColumns = [
    { title: "Barcode", dataIndex: "barcode" },
    { title: "Product", dataIndex: "productCode" },
    { title: "Production", dataIndex: "productionCode" },
    { title: "CITES", dataIndex: "citesNumber" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "isSold",
      render: (val: boolean) =>
        val ? <Tag color="red">Sold</Tag> : <Tag color="green">Available</Tag>,
    },
    {
      title: "",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => navigate(`/finished-products/${record.finishedProductId}`)}
        >
          Details
        </Button>
      ),
    },
  ];

  // ── Stock columns ───────────────────────────────────────────
  const stockColumns = [
    { title: "Product Code", dataIndex: "productCode" },
    {
      title: "Available Quantity",
      dataIndex: "quantityAvailable",
      render: (val: number) => (
        <Tag color={val > 0 ? "green" : "red"}>{val}</Tag>
      ),
    },
  ];

  return (
    <Card>
      {/* ── Toolbar ── */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        {/* LEFT */}
        <Col>
          {viewMode === "production" ? (
            <Space>
              <Input.Search
                placeholder="Search by barcode or product"
                allowClear
                enterButton={<Button>Search</Button>}
                style={{ width: 300 }}
                onSearch={(value) => {
                  setPageNumber(1);
                  setSearchTerm(value);
                }}
              />
              <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
                Filter
              </Button>
              {isFilterActive && (
                <Button danger onClick={handleResetFilter}>
                  Reset Filter
                </Button>
              )}
            </Space>
          ) : (
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              Showing available stock grouped by product
            </span>
          )}
        </Col>

        {/* RIGHT — view toggle */}
        <Col>
          <Segmented
            value={viewMode}
            onChange={(val) => setViewMode(val as ViewMode)}
            options={[
              {
                value: "production",
                icon: <UnorderedListOutlined />,
                label: "By Production",
              },
              {
                value: "stock",
                icon: <AppstoreOutlined />,
                label: "By Stock",
              },
            ]}
          />
        </Col>
      </Row>

      {/* ── Production Table ── */}
      {viewMode === "production" && (
        <Table
          rowKey="finishedProductId"
          columns={productionColumns}
          dataSource={items}
          loading={loading}
          pagination={{
            current: pageNumber,
            pageSize,
            total: totalCount,
            showSizeChanger: true,
            hideOnSinglePage: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size);
            },
          }}
        />
      )}

      {/* ── Stock Table ── */}
      {viewMode === "stock" && (
        <Table
          rowKey="productId"
          columns={stockColumns}
          dataSource={stockItems}
          loading={stockLoading}
          pagination={{ hideOnSinglePage: true, pageSize: 10 }}
        />
      )}

      {/* ── Filter Modal ── */}
      <Modal
        title="Filter Finished Products"
        open={filterOpen}
        onCancel={() => setFilterOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleApplyFilter}>
          <Form.Item name="isSold" label="Status">
            <Select allowClear>
              <Select.Option value={true}>Sold</Select.Option>
              <Select.Option value={false}>Available</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="productId" label="Product">
            <Select
              allowClear
              loading={loadingFilters}
              options={products.map((p) => ({ value: p.productId, label: p.productCode }))}
            />
          </Form.Item>

          <Form.Item name="productionId" label="Production">
            <Select
              allowClear
              loading={loadingFilters}
              options={productions.map((p) => ({ value: p.productionId, label: p.productionCode }))}
            />
          </Form.Item>

          <Form.Item name="citesInboundId" label="CITES">
            <Select
              allowClear
              loading={loadingFilters}
              options={citesList.map((c) => ({ value: c.citesInboundId, label: c.citesNumber }))}
            />
          </Form.Item>

          <Form.Item name="dateRange" label="Created Date">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={() => setFilterOpen(false)}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Apply Filter
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}
