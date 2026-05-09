import { message } from "antd";

// Fallback to static antd message API.
// Wrap your root with antd <App> to consume theme context properly.
export const showError = (msg: string) => message.error(msg);
export const showSuccess = (msg: string) => message.success(msg);
export const showWarning = (msg: string) => message.warning(msg);
