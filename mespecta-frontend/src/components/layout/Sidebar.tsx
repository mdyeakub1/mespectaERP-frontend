import { Layout, Menu } from "antd";
import {
  SafetyCertificateFilled,
  ThunderboltFilled,
  GiftFilled,
  AppstoreFilled,
  DatabaseFilled,
  ShopFilled,
  ContactsFilled,
  ToolFilled,
  SettingFilled,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;

    if (path.startsWith("/cites-inbounds"))
      return "/cites-inbounds";

    if (path.startsWith("/productions"))
      return "/productions";

    if (path.startsWith("/finished-products"))
      return "/finished-products";

    if (path.startsWith("/products"))
      return "/products";

    if (path.startsWith("/materials"))
      return "/materials";

    if (path.startsWith("/suppliers"))
      return "/suppliers";

    if (path.startsWith("/customers"))
      return "/customers";

    if (path.startsWith("/craftsmen"))
      return "/craftsmen";

    if (path.startsWith("/admin-setup"))
      return "/admin-setup";

    return path;
  };

  return (
    <Sider collapsible style={{ height: "100vh", position: "sticky", top: 0, left: 0, overflow: "auto" }}>
      <div
        style={{
          color: "white",
          padding: 24,
          fontWeight: 600,
          fontSize: 20
        }}
      >
        Mespecta ERP
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        onClick={({ key }) => navigate(key)}
        items={[
          {
            key: "/cites-inbounds",
            icon: <SafetyCertificateFilled />,
            label: "CITES Inbound",
          },
          {
            key: "/productions",
            icon: <ThunderboltFilled />,
            label: "Productions",
          },
          {
            key: "/finished-products",
            icon: <GiftFilled />,
            label: "Finished Products",
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
            key: "/suppliers",
            icon: <ShopFilled />,
            label: "Suppliers",
          },
          {
            key: "/customers",
            icon: <ContactsFilled />,
            label: "Customers",
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