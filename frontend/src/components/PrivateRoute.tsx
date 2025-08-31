import Cookies from "js-cookie";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import BootstrapProfile from "../store/BootstrapProfile";

type PrivateRouteProps = PropsWithChildren;

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = Cookies.get("access_token");
  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <BootstrapProfile />
      {children}
    </>
  );
}
