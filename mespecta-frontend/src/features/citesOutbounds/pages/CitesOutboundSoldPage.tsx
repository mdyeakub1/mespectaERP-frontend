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
} from "antd";
import { FilterOutlined, SettingOutlined, FileExcelOutlined, FilePdfOutlined, HolderOutlined } from "@ant-design/icons";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCitesOutboundSold } from "../citesOutboundSold.slice";
import type { CitesOutboundSoldItem } from "../citesOutboundSold.types";

const ALL_COLUMNS = [
  { key: "serialNo",             title: "Serial No.",          dataIndex: "serialNo" },
  { key: "date",                 title: "Date",                dataIndex: "date",                 render: (val: string) => val ? new Date(val).toISOString().slice(0, 10) : "-" },
  { key: "scientificName",       title: "Scientific Name",     dataIndex: "scientificName" },
  { key: "commonName",           title: "Common Name",         dataIndex: "commonName" },
  { key: "acquisitionType",      title: "Acquisition Type",    dataIndex: "acquisitionType" },
  { key: "source",               title: "Source",              dataIndex: "source" },
  { key: "documentType",         title: "Document Type",       dataIndex: "documentType" },
  { key: "citesNumber",          title: "CITES Document",      dataIndex: "citesNumber" },
  { key: "identification",       title: "Identification",      dataIndex: "identification" },
  { key: "quantity",             title: "Quantity",            render: (_: any, r: CitesOutboundSoldItem) => `${r.quantity} ${r.quantityUnit}` },
  { key: "inboundReference",     title: "Inbound Reference",   dataIndex: "inboundReference" },
  { key: "outboundReason",       title: "Outbound Reason",     dataIndex: "outboundReason" },
  { key: "outgoingDocumentType", title: "Outgoing Document",   dataIndex: "outgoingDocumentType" },
  { key: "destination",          title: "Destination",         dataIndex: "destination" },
  { key: "customerName",         title: "Customer",         dataIndex: "customerName" },
  { key: "productCode",          title: "Product Code",     dataIndex: "productCode" },
  { key: "craftsmanName",        title: "Craftsman",        dataIndex: "craftsmanName" },
];

const DEFAULT_VISIBLE = ALL_COLUMNS.map((c) => c.key);

export default function CitesOutboundSoldPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, totalCount, loading } = useAppSelector(
    (state) => state.citesOutboundSold
  );

  const [searchText, setSearchText]           = useState("");
  const [pageNumber, setPageNumber]           = useState(1);
  const [pageSize, setPageSize]               = useState(10);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters]                 = useState<any>({});
  const [visibleKeys, setVisibleKeysState]    = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("cites-outbound-sold-columns");
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        const valid = parsed.filter((k) => ALL_COLUMNS.some((c) => c.key === k));
        if (valid.length > 0) return valid;
      }
    } catch { /* ignore */ }
    return DEFAULT_VISIBLE;
  });

  const setVisibleKeys = (keys: string[] | ((prev: string[]) => string[])) => {
    setVisibleKeysState((prev) => {
      const next = typeof keys === "function" ? keys(prev) : keys;
      localStorage.setItem("cites-outbound-sold-columns", JSON.stringify(next));
      return next;
    });
  };

  const [columnOrder, setColumnOrderState]    = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("cites-outbound-sold-column-order");
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
    localStorage.setItem("cites-outbound-sold-column-order", JSON.stringify(order));
  };

  const dragKey                               = useRef<string | null>(null);
  const [dragOverKey, setDragOverKey]         = useState<string | null>(null);
  const [colPopoverOpen, setColPopoverOpen]   = useState(false);
  const [exportingExcel, setExportingExcel]   = useState(false);
  const [exportingPdf, setExportingPdf]       = useState(false);
  const [sortBy, setSortBy]                   = useState<string | undefined>(undefined);
  const [sortDescending, setSortDescending]   = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    dispatch(fetchCitesOutboundSold({
      search: searchText, pageNumber, pageSize, ...filters,
      ...(sortBy ? { sortBy, sortDescending } : {}),
    }));
  }, [dispatch, searchText, pageNumber, pageSize, filters, sortBy, sortDescending]);

  // ================= EXPORT =================
  const handleExport = async (type: "excel" | "pdf") => {
    const setLoading = type === "excel" ? setExportingExcel : setExportingPdf;
    const ext  = type === "excel" ? "xlsx" : "pdf";
    const mime = type === "excel"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf";
    try {
      setLoading(true);
      const res = await api.get(`/finished-products/sold/export/${type}`, {
        params: { search: searchText, ...filters },
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `cites-outbound-sold.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // interceptor handles toast
    } finally {
      setLoading(false);
    }
  };

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
  };

  const handleResetFilter = () => { setFilters({}); setPageNumber(1); };

  const isFilterActive = Object.values(filters).some(
    (v) => v !== undefined && v !== null && v !== ""
  );

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
      render: (_: any, record: CitesOutboundSoldItem) => (
        <Button type="link" onClick={() => navigate(`/cites-outbounds/sold/${record.finishedProductId}`)}>
          Details
        </Button>
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
              placeholder="Search sold records"
              allowClear
              enterButton={<Button>Search</Button>}
              style={{ width: 280 }}
              onSearch={handleSearch}
            />
            <Button icon={<FilterOutlined />} onClick={() => setFilterModalOpen(true)}>
              Filter
            </Button>
            {isFilterActive && (
              <Button danger onClick={handleResetFilter}>Reset Filter</Button>
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

      {/* FILTER MODAL */}
      <Modal
        title="Filter Sold Records"
        open={filterModalOpen}
        onCancel={() => setFilterModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleApplyFilter}>
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
