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
  Select,
  Form,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchProducts,
  removeProduct,
} from "../products.slice";
import ProductDrawer from "../components/ProductForm";
import api from "../../../services/api";
import ProductDetailsDrawer from "../components/ProductDetailsDrawer";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { data,totalCount, loading } = useAppSelector(
    (state) => state.products
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
const [detailsId, setDetailsId] = useState<number | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<any>(null);

  const [search, setSearch]                   = useState("");
  const [pageNumber, setPageNumber]           = useState(1);
  const [pageSize, setPageSize]               = useState(10);
  const [filters, setFilters]                 = useState<any>({});
  const [filterOpen, setFilterOpen]           = useState(false);
  const [sortBy, setSortBy]                   = useState<string | undefined>(undefined);
  const [sortDescending, setSortDescending]   = useState(true);

  const [categories, setCategories] = useState<any[]>([]);
  const [genders, setGenders] = useState<any[]>([]);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf]     = useState(false);

  const [form] = Form.useForm();

  /* ================= FETCH PRODUCTS ================= */
useEffect(() => {
  dispatch(
    fetchProducts({
      search,
      pageNumber,
      pageSize,
      ...filters,
      ...(sortBy ? { sortBy, sortDescending } : {}),
    })
  );
}, [dispatch, search, pageNumber, pageSize, filters, sortBy, sortDescending]);

  /* ================= LOAD FILTER DROPDOWNS ================= */
  useEffect(() => {
    if (filterOpen) {
      loadDropdowns();
    }
  }, [filterOpen]);

  const loadDropdowns = async () => {
    try {
      const [catRes, genRes] = await Promise.all([
        api.get("/product-categories"),
        api.get("/product-genders"),
      ]);

      const extract = (res: any) =>
        res.data?.data?.items ?? res.data?.data ?? [];

      setCategories(extract(catRes));
      setGenders(extract(genRes));
    } catch {
      // interceptor handles toast
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
     await dispatch(
  removeProduct({
    id: selectedRecord.productId,
    params: {
      search,
      pageNumber,
      pageSize,
      ...filters,
    },
  })
).unwrap();

      message.success("Product deleted successfully");
      setDeleteModalOpen(false);
    } catch {
      // interceptor handles toast
    }
  };

  const handleExport = async (format: "excel" | "pdf") => {
    const setLoading = format === "excel" ? setExportingExcel : setExportingPdf;
    const ext        = format === "excel" ? "xlsx" : "pdf";
    const mime       = format === "excel" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "application/pdf";
    try {
      setLoading(true);
      const res = await api.get(`/products/export/${format}`, { responseType: "blob" });
      const url  = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `products.${ext}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      // interceptor handles toast
    } finally {
      setLoading(false);
    }
  };

  const isFilterActive =
    Object.keys(filters).length > 0;

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { title: "Code", dataIndex: "productCode" },
    { title: "Description", dataIndex: "description" },
    { title: "Category", dataIndex: "categoryName" },
    { title: "Gender", dataIndex: "genderName" },
    { title: "Leather Type", render: (_: any, r: any) => r.leathers?.[0]?.leatherTypeName ?? "-" },
    { title: "Leather Qty",  render: (_: any, r: any) => r.leathers?.[0]?.quantityRequired ?? "-" },
    { title: "UOM",          render: (_: any, r: any) => r.leathers?.[0]?.unitOfMeasureName ?? "-" },
    { title: "Note",         render: (_: any, r: any) => r.leathers?.[0]?.note || "-" },
    { title: "Italy Price",  dataIndex: "priceItaly" },
    { title: "EU Price",     dataIndex: "priceEU" },
    { title: "Outside EU",   dataIndex: "priceOutsideEU" },
    {
  title: "",
  align: "right" as const,
  render: (_: any, record: any) => (
    <Space>
      <Button
        type="link"
        onClick={() => {
          setDetailsId(record.productId);
          setDetailsOpen(true);
        }}
      >
        Details
      </Button>

      <EditOutlined
        style={{ color: "#1677ff", cursor: "pointer" }}
        onClick={async () => {
          try {
            const [categoriesRes, gendersRes, productRes] = await Promise.all([
              api.get("/product-categories"),
              api.get("/product-genders"),
              api.get(`/products/${record.productId}`),
            ]);

            const cats    = categoriesRes.data?.data?.items ?? categoriesRes.data?.data ?? [];
            const gens    = gendersRes.data?.data?.items    ?? gendersRes.data?.data    ?? [];
            const product = productRes.data.data;

            const categoryId = cats.find(
              (c: any) => c.name.toLowerCase() === product.categoryName?.toLowerCase()
            )?.productCategoryId ?? null;

            const genderId = gens.find(
              (g: any) => g.name.toLowerCase() === product.genderName?.toLowerCase()
            )?.productGenderId ?? null;

            setEditingRecord({ ...product, categoryId, genderId });
            setDrawerOpen(true);
          } catch {
            // interceptor handles toast
          }
        }}
      />

      <DeleteOutlined
        style={{ color: "#ff4d4f", cursor: "pointer" }}
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
      {/* ================= TOP BAR ================= */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 20 }}
      >
        <Col>
          <Space>
            <Input.Search
              placeholder="Search by code or description"
              style={{ width: 260 }}
              allowClear
              enterButton={<Button>Search</Button>}
              onSearch={(value) => {
                setPageNumber(1);
                setSearch(value);
              }}
            />

            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterOpen(true)}
            >
              Filter
            </Button>

            <Button
              icon={<FileExcelOutlined />}
              loading={exportingExcel}
              onClick={() => handleExport("excel")}
            >
              Export Excel
            </Button>

            <Button
              icon={<FilePdfOutlined />}
              loading={exportingPdf}
              onClick={() => handleExport("pdf")}
            >
              Export PDF
            </Button>

            {isFilterActive && (
              <Button
                danger
                onClick={() => {
                  setFilters({});
                  setPageNumber(1);
                }}
              >
                Reset Filter
              </Button>
            )}

            <Select
              placeholder="Sort By"
              allowClear
              style={{ width: 155 }}
              value={sortBy}
              onChange={(val) => { setSortBy(val); setPageNumber(1); }}
              options={[
                { value: "ProductCode",    label: "Product Code" },
                { value: "Description",    label: "Description" },
                { value: "PriceItaly",     label: "Italy Price" },
                { value: "PriceEU",        label: "EU Price" },
                { value: "PriceOutsideEU", label: "Outside EU" },
                { value: "CategoryName",   label: "Category" },
                { value: "GenderName",     label: "Gender" },
                { value: "CreatedAt",      label: "Created At" },
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRecord(null);
              setDrawerOpen(true);
            }}
          >
            Add New Product
          </Button>
        </Col>
      </Row>

      {/* ================= TABLE ================= */}
      <Table
  rowKey="productId"
  columns={columns}
  dataSource={data}
  loading={loading}
  pagination={{
    current: pageNumber,
    pageSize: pageSize,
    total: totalCount,
    showSizeChanger: true,
          hideOnSinglePage: true,
    pageSizeOptions: ["10", "20", "50"],
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} of ${total} records`,
    onChange: (page, size) => {
      setPageNumber(page);
      setPageSize(size);
    },
  }}
/>

      {/* ================= DRAWER ================= */}
      <ProductDrawer
        open={drawerOpen}
        initialData={editingRecord}
        params={{ search, pageNumber, pageSize, ...filters, ...(sortBy ? { sortBy, sortDescending } : {}) }}
        onClose={() => setDrawerOpen(false)}
      />

      <ProductDetailsDrawer
  open={detailsOpen}
  productId={detailsId}
  onClose={() => setDetailsOpen(false)}
/>

      {/* ================= DELETE MODAL ================= */}
      <Modal
        title="Confirm Delete"
        open={deleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to delete{" "}
        <strong>
          {selectedRecord?.productCode}
        </strong>
        ?
      </Modal>

      {/* ================= FILTER MODAL ================= */}
      <Modal
        title="Filter Products"
        open={filterOpen}
        onCancel={() => setFilterOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            setPageNumber(1);
            setFilters({
              categoryId: values.categoryId,
              genderId: values.genderId,
            });
            setFilterOpen(false);
          }}
        >
          <Form.Item
            name="categoryId"
            label="Category"
          >
            <Select
              allowClear
              options={categories.map((c) => ({
                value: c.productCategoryId,
                label: c.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="genderId"
            label="Gender"
          >
            <Select
              allowClear
              options={genders.map((g) => ({
                value: g.productGenderId,
                label: g.name,
              }))}
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
    </Card>
  );
}