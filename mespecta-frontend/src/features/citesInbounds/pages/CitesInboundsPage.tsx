import { useEffect, useState } from "react";
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
} from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCitesInbounds } from "../citesInbounds.slice";
import AddCitesInboundModal from "../components/AddCitesInboundModal";
import api from "../../../services/api";

export default function CitesInboundsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [leatherTypes, setLeatherTypes] = useState<any[]>([]);
const [colors, setColors] = useState<any[]>([]);
const [loadingFilters, setLoadingFilters] = useState(false);

  const [addModalOpen, setAddModalOpen] =
  useState(false);

  const { items, totalCount, loading } =
    useAppSelector((state) => state.citesInbounds);

  const [searchText, setSearchText]           = useState("");
  const [pageNumber, setPageNumber]           = useState(1);
  const [pageSize, setPageSize]               = useState(10);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters]                 = useState<any>({});
  const [sortBy, setSortBy]                   = useState<string | undefined>(undefined);
  const [sortDescending, setSortDescending]   = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    dispatch(
      fetchCitesInbounds({
        search: searchText,
        pageNumber,
        pageSize,
        ...filters,
        ...(sortBy ? { sortBy, sortDescending } : {}),
      })
    );
  }, [dispatch, searchText, pageNumber, pageSize, filters, sortBy, sortDescending]);

  // ================= SEARCH =================
  const handleSearch = (value: string) => {
    setPageNumber(1);
    setSearchText(value);
  };


  const loadFilterDropdowns = async () => {
  try {
    setLoadingFilters(true);

    const [leatherRes, colorRes] =
      await Promise.all([
        api.get("/leather-types"),
        api.get("/colors"),
      ]);

    const extract = (res: any) => {
      if (Array.isArray(res.data?.data))
        return res.data.data;

      if (res.data?.data?.items)
        return res.data.data.items;

      return [];
    };

    setLeatherTypes(extract(leatherRes));
    setColors(extract(colorRes));
  } catch {
    // interceptor handles toast
  } finally {
    setLoadingFilters(false);
  }
};

useEffect(() => {
  if (filterModalOpen) {
    loadFilterDropdowns();
  }
}, [filterModalOpen]);

  // ================= FILTER =================
  const handleApplyFilter = (values: any) => {
    setPageNumber(1);

    setFilters({
      leatherTypeId: values.leatherTypeId,
      colorId: values.colorId,
      fromDate: values.dateRange
        ? values.dateRange[0].toISOString()
        : undefined,
      toDate: values.dateRange
        ? values.dateRange[1].toISOString()
        : undefined,
    });

    setFilterModalOpen(false);
  };

  const isFilterActive = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== ""
  );

  // ================= EXPORT =================
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const handleExport = async (type: "excel" | "pdf") => {
    const setLoading = type === "excel" ? setExportingExcel : setExportingPdf;
    const ext = type === "excel" ? "xlsx" : "pdf";
    const mime = type === "excel"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf";

    // Build params matching the current table filters
    const params: Record<string, any> = {};
    if (searchText)            params.search           = searchText;
    if (filters.leatherTypeId) params.leatherTypeId    = filters.leatherTypeId;
    if (filters.colorId)       params.colorId          = filters.colorId;
    if (filters.fromDate)      params.fromDate         = filters.fromDate;
    if (filters.toDate)        params.toDate           = filters.toDate;

    try {
      setLoading(true);
      const res = await api.get(`/cites-inbounds/export/${type}`, {
        params,
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `cites-inbounds.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // interceptor handles toast
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilter = () => {
    setFilters({});
    setPageNumber(1);
  };

  const columns = [
    {
      title: "Serial No.",
      dataIndex: "citesInboundSerialNo",
    },
    {
      title: "Date",
      dataIndex: "issueDate",
      render: (val: string) => {
        if (!val) return "-";
        return new Date(val).toISOString().slice(0, 10);
      },
    },
    {
      title: "Scientific Name",
      dataIndex: "scientificName",
    },
    {
      title: "Common Name",
      dataIndex: "commonName",
    },
    {
      title: "Acquisition Type",
      dataIndex: "acquisitionTypeName",
    },
    {
      title: "Source / Origin",
      dataIndex: "sourceName",
    },
    {
      title: "Document Type",
      dataIndex: "documentTypeName",
    },
    {
      title: "CITES Number",
      dataIndex: "citesNumber",
    },
    {
      title: "Identification",
      dataIndex: "identification",
    },
    {
      title: "Quantity",
      dataIndex: "quantityReceived",
      render: (_: any, record: any) =>
        `${record.quantityReceived} ${record.unitOfMeasureCode}`,
    },
    {
      title: "",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/cites-inbounds/${record.citesInboundId}`)
          }
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <Card>
      {/* TOP BAR */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 16 }}
      >
        {/* LEFT */}
        <Col>
          <Space>
            <Input.Search
              placeholder="Search CITES"
              allowClear
              enterButton={<Button>Search</Button>}
              style={{ width: 280 }}
              onSearch={handleSearch}
            />

            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterModalOpen(true)}
            >
              Filter
            </Button>

            {isFilterActive && (
              <Button danger onClick={handleResetFilter}>
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
                { value: "SerialNo",      label: "Serial No." },
                { value: "Date",          label: "Date" },
                { value: "ScientificName",label: "Scientific Name" },
                { value: "CommonName",    label: "Common Name" },
                { value: "CitesNumber",   label: "CITES Number" },
                { value: "Quantity",      label: "Quantity" },
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

        {/* RIGHT */}
        <Col>
          <Space>
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModalOpen(true)}
            >
              Add New
            </Button>
          </Space>
        </Col>
      </Row>

      {/* TABLE */}
      <Table
        rowKey="citesInboundId"
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={{
          current: pageNumber,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} records`,
          onChange: (page, size) => {
            setPageNumber(page);
            setPageSize(size);
          },
        }}
      />

      <AddCitesInboundModal
  open={addModalOpen}
  onClose={() => setAddModalOpen(false)}
/>

      {/* FILTER MODAL */}
      <Modal
  title="Filter CITES Inbounds"
  open={filterModalOpen}
  onCancel={() => setFilterModalOpen(false)}
  footer={null}
>
  <Form
    layout="vertical"
    onFinish={handleApplyFilter}
  >
    <Form.Item
      name="leatherTypeId"
      label="Leather Type"
    >
      <Select
        allowClear
        loading={loadingFilters}
        options={leatherTypes.map((l) => ({
          value: l.leatherTypeId ?? l.id,
          label: l.name,
        }))}
      />
    </Form.Item>

    <Form.Item
      name="colorId"
      label="Color"
    >
      <Select
        allowClear
        loading={loadingFilters}
        options={colors.map((c) => ({
          value: c.colorId ?? c.id,
          label: c.name,
        }))}
      />
    </Form.Item>

    <Form.Item
      name="dateRange"
      label="Issue Date"
    >
      <DatePicker.RangePicker
        style={{ width: "100%" }}
      />
    </Form.Item>

    {/* BUTTONS RIGHT SIDE */}
    <Row justify="end" gutter={8}>
      <Col>
        <Button
          onClick={() =>
            setFilterModalOpen(false)
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