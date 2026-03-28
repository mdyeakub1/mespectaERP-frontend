import { ConfigProvider } from "antd";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBorder: "#e2e8f0",
          borderRadius: 8,
          controlHeight: 36,
          fontSize: 13.5,
          colorPrimary: "#1677ff",
        },
        components: {
          Input: {
            colorBgContainer: "#f8fafc",
            activeBorderColor: "#1677ff",
            hoverBorderColor: "#93c5fd",
            activeShadow: "0 0 0 3px rgba(22,119,255,0.1)",
          },
          Select: {
            colorBgContainer: "#f8fafc",
            optionSelectedBg: "#eff6ff",
          },
          DatePicker: {
            colorBgContainer: "#f8fafc",
            activeBorderColor: "#1677ff",
            hoverBorderColor: "#93c5fd",
          },
          InputNumber: {
            colorBgContainer: "#f8fafc",
            activeBorderColor: "#1677ff",
            hoverBorderColor: "#93c5fd",
            activeShadow: "0 0 0 3px rgba(22,119,255,0.1)",
          },
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;