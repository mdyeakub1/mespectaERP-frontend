import { useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Input,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCraftsmen } from "../craftsmen.slice";


export default function CraftsmenPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, loading } = useAppSelector(
    (state) => state.craftsmen
  );

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchCraftsmen());
  }, [dispatch]);

  /* --------------------------
     FILTER LOGIC
  --------------------------- */
  const filteredData = items.filter((item: any) =>
    item.fullName
      ?.toLowerCase()
      .includes(searchText.toLowerCase()) ||
    item.email
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Total Productions",
      dataIndex: "totalProductions",
    },
    {
      title: "Active Productions",
      dataIndex: "activeProductions",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (val: boolean) =>
        val ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/craftsmen/${record.userId}`)
          }
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <Card>
      {/* HEADER */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 16 }}
      >
    

        <Col>
          <Input
            placeholder="Search by name or email"
            style={{ width: 280 }}
            allowClear
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
          />
        </Col>
      </Row>

      <Table 
        rowKey="userId"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
      />
    </Card>
  );
}