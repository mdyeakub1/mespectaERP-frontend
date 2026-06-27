import { useEffect, useRef, useState } from "react";
import {
  Table,
  Card,
  Input,
  Row,
  Col,
  Button,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  Popover,
  Checkbox,
  Divider,
  Tag,
  message,
} from "antd";
import { FilterOutlined, SettingOutlined, FileExcelOutlined, FilePdfOutlined, HolderOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import api from "../../../services/api";
import { fetchCitesOutboundStock } from "../citesOutboundStock.slice";
import type { CitesOutboundStockItem } from "../citesOutboundStock.types";
import { formatHours } from "../../../utils/formatHours";

const ALL_COLUMNS = [
  { key: "serialNo",                title: "Serial No.",          dataIndex: "serialNo" },
  { key: "date",                    title: "Date",                dataIndex: "date",                    render: (val: string) => val ? new Date(val).toISOString().slice(0, 10) : "-" },
  { key: "scientificName",          title: "Scientific Name",     dataIndex: "scientificName" },
  { key: "commonName",              title: "Common Name",         dataIndex: "commonName" },
  { key: "acquisitionType",         title: "Acquisition Type",    dataIndex: "acquisitionType" },
  { key: "source",                  title: "Source",              dataIndex: "source" },
  { key: "documentType",            title: "Document Type",       dataIndex: "documentType" },
  { key: "citesNumber",             title: "CITES Document",      dataIndex: "citesNumber" },
  { key: "identification",          title: "Identification",      dataIndex: "identification" },
  { key: "quantity",                title: "Quantity",            render: (_: any, r: CitesOutboundStockItem) => `${r.quantity} ${r.quantityUnit}` },
  { key: "inboundReference",        title: "Inbound Reference",   dataIndex: "inboundReference" },
  { key: "outboundReason",          title: "Outbound Reason",     dataIndex: "outboundReason" },
  { key: "outgoingDocumentType",    title: "Outgoing Document",   dataIndex: "outgoingDocumentType" },
  { key: "destination",             title: "Destination",         dataIndex: "destination" },
  { key: "productCode",             title: "Product Code",        dataIndex: "productCode" },
  { key: "productDescription",      title: "Description",         dataIndex: "productDescription" },
  { key: "craftsmanName",           title: "Craftsman",           dataIndex: "craftsmanName" },
  { key: "totalWorkingHoursDisplay",title: "Working Hours",       render: (_: any, r: CitesOutboundStockItem) => formatHours(r.totalWorkingHours) },
  { key: "status",                  title: "Status",              dataIndex: "status",                  render: (val: string) => val === "Sold" ? <Tag color="green">{val}</Tag> : <Tag color="orange">{val}</Tag> },
];

const DEFAULT_VISIBLE = ALL_COLUMNS.map((c) => c.key);

export default function CitesOutboundStockPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, totalCount, loading } = useAppSelector(
    (state) => state.citesOutboundStock
  );

  const [filterForm] = Form.useForm();
  const [searchText, setSearchText]           = useState("");
  const [pageNumber, setPageNumber]           = useState(1);
  const [pageSize, setPageSize]               = useState(10);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters]                 = useState<any>({});
  const [visibleKeys, setVisibleKeysState]    = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("cites-outbound-stock-columns");
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        // keep only keys that still exist in ALL_COLUMNS
        const valid = parsed.filter((k) => ALL_COLUMNS.some((c) => c.key === k));
        if (valid.length > 0) return valid;
      }
    } catch { /* ignore */ }
    return DEFAULT_VISIBLE;
  });

  const setVisibleKeys = (keys: string[] | ((prev: string[]) => string[])) => {
    setVisibleKeysState((prev) => {
      const next = typeof keys === "function" ? keys(prev) : keys;
      localStorage.setItem("cites-outbound-stock-columns", JSON.stringify(next));
      return next;
    });
  };

  const [columnOrder, setColumnOrderState]    = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("cites-outbound-stock-column-order");
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        const valid   = parsed.filter((k) => ALL_COLUMNS.some((c) => c.key === k));
        const missing = ALL_COLUMNS.map((c) => c.key).filter((k) => !valid.includes(k));
        return [...valid, ...missing];
      }
    } catch { /* ignore */ }
    return ALL_COLUMNS.map((c) => c.key);
  });

  const setColumnOrder = (order: string[]) => {
    setColumnOrderState(order);
    localStorage.setItem("cites-outbound-stock-column-order", JSON.stringify(order));
  };

  const dragKey                               = useRef<string | null>(null);
  const [dragOverKey, setDragOverKey]         = useState<string | null>(null);
  const [colPopoverOpen, setColPopoverOpen]   = useState(false);
  const [exportingExcel, setExportingExcel]   = useState(false);
  const [exportingPdf, setExportingPdf]       = useState(false);
  const [sellModalOpen, setSellModalOpen]     = useState(false);
  const [selectedItem, setSelectedItem]       = useState<CitesOutboundStockItem | null>(null);
  const [selling, setSelling]                 = useState(false);
  const [sellForm]                            = Form.useForm();
  const [sortBy, setSortBy]                   = useState<string | undefined>(undefined);
  const [sortDescending, setSortDescending]   = useState(true);
  const [searchResetKey, setSearchResetKey]   = useState(0);

  // ================= FETCH =================
  useEffect(() => {
    dispatch(fetchCitesOutboundStock({
      search: searchText, pageNumber, pageSize, ...filters,
      ...(sortBy ? { sortBy, sortDescending } : {}),
    }));
  }, [dispatch, searchText, pageNumber, pageSize, filters, sortBy, sortDescending]);

  // ================= SEARCH =================
  const handleSearch = (value: string) => { setPageNumber(1); setSearchText(value); };

  // ================= FILTER =================
  const handleApplyFilter = (values: any) => {
    setPageNumber(1);
    setFilters({
      status:   values.status,
      fromDate: values.dateRange ? values.dateRange[0].toISOString() : undefined,
      toDate:   values.dateRange ? values.dateRange[1].toISOString() : undefined,
    });
    setFilterModalOpen(false);
    filterForm.resetFields();
  };

  const handleResetFilter = () => {
    setFilters({});
    setSearchText("");
    setSortBy(undefined);
    setSortDescending(true);
    setPageNumber(1);
    setSearchResetKey((k) => k + 1);
  };

  // ================= EXPORT =================
  const handleExport = async (type: "excel" | "pdf") => {
    const setLoading = type === "excel" ? setExportingExcel : setExportingPdf;
    const ext  = type === "excel" ? "xlsx" : "pdf";
    const mime = type === "excel"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf";
    try {
      setLoading(true);
      const res = await api.get(`/finished-products/stock/export/${type}`, {
        params: { search: searchText, ...filters },
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `cites-outbound-stock.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // interceptor handles toast
    } finally {
      setLoading(false);
    }
  };

  // ================= SELL =================
  const openSellModal = (record: CitesOutboundStockItem) => {
    setSelectedItem(record);
    sellForm.resetFields();
    setSellModalOpen(true);
  };

  const handleSell = async () => {
    try {
      const values = await sellForm.validateFields();
      setSelling(true);
      await api.post(`/finished-products/${selectedItem!.finishedProductId}/sell`, {
        customerName: values.customerName,
        orderId:      values.orderId?.trim() || null,
        description:  values.description?.trim() || null,
      });
      message.success("Item sold successfully");
      setSellModalOpen(false);
      dispatch(fetchCitesOutboundStock({ search: searchText, pageNumber, pageSize, ...filters }));
    } catch {
      // validation or API error
    } finally {
      setSelling(false);
    }
  };

  const isFilterActive =
    Object.values(filters).some((v) => v !== undefined && v !== null && v !== "") ||
    Boolean(searchText) ||
    Boolean(sortBy);

  // ================= COLUMNS =================
  const orderedColumns = columnOrder
    .map((key) => ALL_COLUMNS.find((c) => c.key === key))
    .filter(Boolean) as typeof ALL_COLUMNS;

  const tableColumns = [
    ...orderedColumns.filter((c) => visibleKeys.includes(c.key)),
    {
      key: "_actions",
      title: "",
      align: "right" as const,
      fixed: "right" as const,
      render: (_: any, record: CitesOutboundStockItem) => (
        <Space>
          {!record.isSold && (
            <Button type="primary" size="small" onClick={() => openSellModal(record)}>
              Sale
            </Button>
          )}
          <Button type="link" onClick={() => navigate(`/cites-outbounds/stock/${record.finishedProductId}`)}>
            Details
          </Button>
        </Space>
      ),
    },
  ];

  // ================= COLUMN TOGGLE POPOVER =================
  const columnToggleContent = (
    <div style={{ width: 240, maxHeight: 420, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => setVisibleKeys(DEFAULT_VISIBLE)}>
          Select all
        </Button>
        <Button type="link" size="small" danger style={{ padding: 0 }} onClick={() => setVisibleKeys([])}>
          Clear all
        </Button>
      </div>
      <Divider style={{ margin: "4px 0 8px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {columnOrder
          .map((key) => ALL_COLUMNS.find((c) => c.key === key))
          .filter(Boolean)
          .map((col) => (
            <div
              key={col!.key}
              draggable
              onDragStart={() => { dragKey.current = col!.key; }}
              onDragOver={(e) => { e.preventDefault(); setDragOverKey(col!.key); }}
              onDragLeave={() => setDragOverKey(null)}
              onDrop={(e) => {
                e.preventDefault();
                if (!dragKey.current || dragKey.current === col!.key) return;
                const from = columnOrder.indexOf(dragKey.current);
                const to   = columnOrder.indexOf(col!.key);
                const next = [...columnOrder];
                next.splice(from, 1);
                next.splice(to, 0, dragKey.current);
                setColumnOrder(next);
                dragKey.current = null;
                setDragOverKey(null);
              }}
              onDragEnd={() => { dragKey.current = null; setDragOverKey(null); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 6px",
                borderRadius: 4,
                background: dragOverKey === col!.key ? "#e6f4ff" : "transparent",
                border: dragOverKey === col!.key ? "1px dashed #1677ff" : "1px solid transparent",
                cursor: "grab",
                userSelect: "none",
              }}
            >
              <HolderOutlined style={{ color: "#bfbfbf", fontSize: 12, flexShrink: 0 }} />
              <Checkbox
                checked={visibleKeys.includes(col!.key)}
                onChange={(e) =>
                  setVisibleKeys((prev) =>
                    e.target.checked ? [...prev, col!.key] : prev.filter((k) => k !== col!.key)
                  )
                }
              >
                {col!.title}
              </Checkbox>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <Card>
      {/* TOP BAR */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Input.Search
              key={searchResetKey}
              placeholder="Search stock records"
              allowClear
              enterButton={<Button>Search</Button>}
              style={{ width: 280 }}
              onSearch={handleSearch}
            />
            <Button icon={<FilterOutlined />} onClick={() => setFilterModalOpen(true)}>
              Filter
            </Button>
            {isFilterActive && (
              <Button danger onClick={handleResetFilter}>Reset</Button>
            )}
            <Select
              placeholder="Sort By"
              allowClear
              style={{ width: 155 }}
              value={sortBy}
              onChange={(val) => { setSortBy(val); setPageNumber(1); }}
              options={[
                { value: "SerialNo",       label: "Serial No." },
                { value: "Date",           label: "Date" },
                { value: "ScientificName", label: "Scientific Name" },
                { value: "CommonName",     label: "Common Name" },
                { value: "CitesNumber",    label: "CITES Number" },
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
          <Space>
            <Button icon={<FileExcelOutlined />} loading={exportingExcel} onClick={() => handleExport("excel")}>Export Excel</Button>
            <Button icon={<FilePdfOutlined />}   loading={exportingPdf}   onClick={() => handleExport("pdf")}>Export PDF</Button>
            <Popover
              content={columnToggleContent}
              title="Show / Hide Columns"
              trigger="click"
              open={colPopoverOpen}
              onOpenChange={setColPopoverOpen}
              placement="bottomRight"
            >
              <Button icon={<SettingOutlined />}>Columns</Button>
            </Popover>
          </Space>
        </Col>
      </Row>

      {/* TABLE */}
      <Table
        rowKey="finishedProductId"
        columns={tableColumns}
        dataSource={items}
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{
          current: pageNumber,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          hideOnSinglePage: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
          onChange: (page, size) => { setPageNumber(page); setPageSize(size); },
        }}
      />

      {/* SELL MODAL */}
      <Modal
        title={`Sell — #${selectedItem?.serialNo}`}
        open={sellModalOpen}
        onCancel={() => setSellModalOpen(false)}
        onOk={handleSell}
        okText="Confirm Sale"
        confirmLoading={selling}
        destroyOnHidden
      >
        <Form layout="vertical" form={sellForm} style={{ marginTop: 8 }}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true, message: "Customer name is required." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="orderId" label="Order ID">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* FILTER MODAL */}
      <Modal
        title="Filter Stock Records"
        open={filterModalOpen}
        onCancel={() => setFilterModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={filterForm} onFinish={handleApplyFilter}>
          <Form.Item name="status" label="Status">
            <Select
              allowClear
              options={[
                { value: "Sold",     label: "Sold" },
                { value: "Not Sold", label: "Not Sold" },
              ]}
            />
          </Form.Item>
          <Form.Item name="dateRange" label="Date Range">
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Row justify="end" gutter={8}>
            <Col><Button onClick={() => setFilterModalOpen(false)}>Cancel</Button></Col>
            <Col><Button type="primary" htmlType="submit">Apply Filter</Button></Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}
