import { Layout, Menu } from "antd";
import {
  SafetyCertificateFilled,
  ExportOutlined,
  ThunderboltFilled,
  AppstoreFilled,
  DatabaseFilled,
  ToolFilled,
  SettingFilled,
  ShoppingCartOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const CITES_OUTBOUND_KEY = "/cites-outbounds";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith("/cites-inbounds"))   return "/cites-inbounds";
    if (path.startsWith("/cites-outbounds/sold"))  return "/cites-outbounds/sold";
    if (path.startsWith("/cites-outbounds/stock")) return "/cites-outbounds/stock";
    if (path.startsWith("/productions"))      return "/productions";
    if (path.startsWith("/products"))         return "/products";
    if (path.startsWith("/materials"))        return "/materials";
    if (path.startsWith("/craftsmen"))        return "/craftsmen";
    if (path.startsWith("/admin-setup"))      return "/admin-setup";
    return path;
  };

  const getOpenKeys = () => {
    if (location.pathname.startsWith("/cites-outbounds")) return [CITES_OUTBOUND_KEY];
    return [];
  };

  return (
    <Sider collapsible style={{ height: "100vh", position: "sticky", top: 0, left: 0, overflow: "auto" }}>
      <div
        style={{
          color: "white",
          padding: 24,
          fontWeight: 600,
          fontSize: 20,
        }}
      >
        Mespecta ERP
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        defaultOpenKeys={getOpenKeys()}
        onClick={({ key }) => navigate(key)}
        items={[
          {
            key: "/cites-inbounds",
            icon: <SafetyCertificateFilled />,
            label: "CITES Inbound",
          },
          {
            key: CITES_OUTBOUND_KEY,
            icon: <ExportOutlined />,
            label: "CITES Outbound",
            children: [
              {
                key: "/cites-outbounds/sold",
                icon: <ShoppingCartOutlined />,
                label: "Sold",
              },
              {
                key: "/cites-outbounds/stock",
                icon: <InboxOutlined />,
                label: "Stock",
              },
            ],
          },
          {
            key: "/productions",
            icon: <ThunderboltFilled />,
            label: "Productions",
          },
          {
            key: "/products",
            icon: <AppstoreFilled />,
            label: "Products",
          },
          {
            key: "/materials",
            icon: <DatabaseFilled />,
            label: "Materials",
          },
          {
            key: "/craftsmen",
            icon: <ToolFilled />,
            label: "Craftsmen",
          },
          {
            key: "/admin-setup",
            icon: <SettingFilled />,
            label: "Admin Setup",
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;