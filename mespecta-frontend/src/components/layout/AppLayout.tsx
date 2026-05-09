import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

const { Content } = Layout;

const AppLayout = () => {
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Layout style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1, minWidth: 0 }}>
        <HeaderBar />
        <Content style={{ margin: 16, flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;