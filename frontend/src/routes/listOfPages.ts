import { lazy } from "react";

const PageImport = () => import("@/components/Page");
const ProfileImport = () => import("@/pages/Profile");
const FriendsImport = () => import("@/pages/Friends");
const DashboardImport = () => import("@/pages/Dashboard");
const AuthImport = () => import("@/pages/Auth");
const PrivateRouteImport = () => import("@/components/PrivateRoute");
const PrivateLayoutImport = () => import("@/components/PrivateLayout");

const pages = {
  Page: lazy(PageImport),
  Profile: lazy(ProfileImport),
  Friends: lazy(FriendsImport),
  Dashboard: lazy(DashboardImport),
  Auth: lazy(AuthImport),
  PrivateRoute: lazy(PrivateRouteImport),
  PrivateLayout: lazy(PrivateLayoutImport),
};

export default pages;
