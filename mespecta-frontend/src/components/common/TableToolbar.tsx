import { Input, Button, Space } from "antd";
import { SearchOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";

interface TableToolbarProps {
  onSearch?: (value: string) => void;
  onAdd?: () => void;
}

const TableToolbar = ({ onSearch, onAdd }: TableToolbarProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      {/* LEFT SIDE */}
      <Space>
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => onSearch?.(e.target.value)}
          style={{ width: 250 }}
        />

        <Button icon={<FilterOutlined />}>
          Filter
        </Button>
      </Space>

      {/* RIGHT SIDE */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAdd}
      >
        Add New
      </Button>
    </div>
  );
};

export default TableToolbar;