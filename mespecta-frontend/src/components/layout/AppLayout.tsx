import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

const { Content } = Layout;

const AppLayout = () => {
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Layout style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <HeaderBar />
        <Content style={{ margin: 16, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;