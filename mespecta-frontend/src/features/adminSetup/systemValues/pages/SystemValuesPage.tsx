import { Layout, Menu } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const SystemValuesLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ background: "#fff",height: "100%" }}>
      <Sider width={250} style={{ background: "#fff" }}>
        <Menu
          mode="inline"
          style={{ padding: 16,height: "100%"}}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
             {
              key: "/admin-setup/system-values/product-categories",
              label: "Product Categories",
            },
            {
              key: "/admin-setup/system-values/material-categories",
              label: "Material Categories",
            },
            {
              key: "/admin-setup/system-values/colors",
              label: "Colors",
            },
            {
              key: "/admin-setup/system-values/leather-types",
              label: "Leather Types",
            },
            {
              key: "/admin-setup/system-values/document-types",
              label: "Document Types",
            },
            {
              key: "/admin-setup/system-values/acquisition-types",
              label: "Acquisition Types",
            },
            {
              key: "/admin-setup/system-values/sources",
              label: "Sources",
            },
            {
              key: "/admin-setup/system-values/unit-of-measures",
              label: "Unit of measures",
            },
            {
              key: "/admin-setup/system-values/outbound-reasons",
              label: "Outbound Reasons",
            },
            {
              key: "/admin-setup/system-values/outgoing-document-types",
              label: "Outgoing Document Types",
            },
            {
              key: "/admin-setup/system-values/destinations",
              label: "Destinations",
            },
           
          ]}
        />
      </Sider>

      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default SystemValuesLayout;