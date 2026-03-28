import { Layout, Menu } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const AdminSetupLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
  if (location.pathname.startsWith("/admin-setup/system-values")) {
    return "/admin-setup/system-values";
  }

  return location.pathname;
};

  return (
    <Layout style={{ background: "#fff" }}>
      <Sider width={250} style={{ background: "#fff" }}>
        <Menu
            mode="inline"
            style={{ padding: 24, height: "100%" }}
            selectedKeys={[getSelectedKey()]}
            onClick={({ key }) => navigate(key)}
            items={[
                {
                key: "/admin-setup/account",
                label: "Account",
                },
                {
                key: "/admin-setup/users",
                label: "Users",
                },
                {
                key: "/admin-setup/system-values",
                label: "System Values",
                },
            ]}
            />
      </Sider>

      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AdminSetupLayout;