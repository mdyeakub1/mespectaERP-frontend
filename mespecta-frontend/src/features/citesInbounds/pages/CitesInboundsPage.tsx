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
  message,
} from "antd";
import {
  FilterOutlined,
  PlusOutlined,
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

  const [searchText, setSearchText] =
    useState("");
  const [pageNumber, setPageNumber] =
    useState(1);
  const [pageSize, setPageSize] =
    useState(10);

  const [filterModalOpen, setFilterModalOpen] =
    useState(false);

  const [filters, setFilters] =
    useState<any>({});

  // ================= FETCH =================
  useEffect(() => {
    dispatch(
      fetchCitesInbounds({
        search: searchText,
        pageNumber,
        pageSize,
        ...filters,
      })
    );
  }, [
    dispatch,
    searchText,
    pageNumber,
    pageSize,
    filters,
  ]);

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
    message.error("Failed to load filters");
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

  const handleResetFilter = () => {
    setFilters({});
    setPageNumber(1);
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "citesInboundCode",
    },
    {
      title: "CITES Number",
      dataIndex: "citesNumber",
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
      title: "Leather Type",
      dataIndex: "leatherTypeName",
    },
    {
      title: "Color",
      dataIndex: "colorName",
    },
    {
      title: "Quantity",
      dataIndex: "quantityReceived",
    },
    {
      title: "Issue Date",
      dataIndex: "issueDate",
      render: (val: string) =>
        new Date(val).toLocaleDateString(),
    },
    {
      title: "",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() =>
            navigate(
              `/cites-inbounds/${record.citesInboundId}`
            )
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
              onClick={() =>
                setFilterModalOpen(true)
              }
            >
              Filter
            </Button>

            {isFilterActive && (
              <Button danger onClick={handleResetFilter}>
                Reset Filter
              </Button>
            )}
          </Space>
        </Col>

        {/* RIGHT */}
        <Col>
          <Button
  type="primary"
  icon={<PlusOutlined />}
  onClick={() => setAddModalOpen(true)}
>
  Add New
</Button>
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
          hideOnSinglePage: true,
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