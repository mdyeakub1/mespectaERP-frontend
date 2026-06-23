import {
  Layout,
  Avatar,
  Typography,
  Dropdown,
  Space,
} from "antd";
import {
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/auth.slice";


const { Header } = Layout;
const { Title, Text } = Typography;

const HeaderBar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get user from auth state
const { email, role } = useAppSelector(
  (state) => state.auth
);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/admin-setup/db-backup")
      return "Database Backup";

    if (path.startsWith("/admin-setup"))
      return "Admin Setup";

    if (path.match(/^\/productions\/\d+/))
      return "Production Details";

    if (path.startsWith("/cites-inbounds"))
      return "CITES Inbound";

    if (path.startsWith("/finished-products/"))
      return "Finished Product Details";

    if (path.match(/^\/cites-outbounds\/sold\/\d+/))
      return "CITES Outbound Details";

    if (path.match(/^\/cites-outbounds\/stock\/\d+/))
      return "CITES Outbound Details";

    if (path.match(/^\/craftsmen\/\d+/))
      return "Craftsman Details";

    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/productions":
        return "Productions";
      case "/finished-products":
        return "Finished Products";
      case "/cites-outbounds/stock":
        return "CITES Outbound — Stock";
      case "/cites-outbounds/sold":
        return "CITES Outbound — Sold";
      case "/products":
        return "Products";
      case "/materials":
        return "Materials";
      case "/suppliers":
        return "Suppliers";
      case "/customers":
        return "Customers";
      case "/craftsmen":
        return "Craftsmen";
      case "/":
        return "Dashboard";
      default:
        return "";
    }
  };

const menuItems = [
  {
    key: "account",
    label: "Account",
    onClick: () => navigate("/admin-setup/account"),
  },
  {
    key: "logout",
    label: "Logout",
    onClick: handleLogout,
  },
];

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      {/* LEFT - Page Title */}
      <Title level={4} style={{ margin: 0 }}>
        {getPageTitle()}
      </Title>

      {/* RIGHT - User Section */}
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
      >
        <Space
          style={{
            cursor: "pointer",
            alignItems: "center",
          }}
        >
          

          <div
            style={{
              display: "flex",
              alignItems:"flex-end",
              flexDirection: "column",
              lineHeight: 1.2,
            }}
          >
            <Text strong>{email}</Text>
<Text type="secondary">{role}</Text>
          </div>
          <Avatar icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;