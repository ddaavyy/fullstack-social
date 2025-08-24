import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ConfigProvider } from "antd";

import AppRoutes from "./routes";

import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#14b8a6", // teal
            colorTextBase: "#e5e7eb",
            colorBgContainer: "#0f172a",
            borderRadius: 12,
          },
        }}
      >
        <Router>
          <ToastContainer />
          <AppRoutes />
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
