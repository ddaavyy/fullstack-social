import { Suspense } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AppRoutes from "./routes/routes";

import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";

const queryClient = new QueryClient();

const Loading = () => {
  return (
    <div className="h-screen w-screen grid place-items-center bg-[#0f1b2b]">
      <LoadingOutlined className="text-2xl text-white/80" />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#14b8a6",
            colorTextBase: "#e5e7eb",
            colorBgContainer: "#0f172a",
            borderRadius: 12,
          },
        }}
      >
        <Router>
          <ToastContainer />
          <Suspense fallback={<Loading />}>
            <AppRoutes />
          </Suspense>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
