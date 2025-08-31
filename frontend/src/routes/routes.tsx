import { Route, Routes } from "react-router-dom";

import pages from "./listOfPages";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <pages.Page title="Login">
            <pages.Auth />
          </pages.Page>
        }
      />
      <Route
        path="/register"
        element={
          <pages.Page title="Registro">
            <pages.Auth />
          </pages.Page>
        }
      />
      <Route element={<pages.PrivateLayout />}>
        <Route
          path="/dashboard"
          element={
            <pages.PrivateRoute>
              <pages.Page title="Dashboard">
                <pages.Dashboard />
              </pages.Page>
            </pages.PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <pages.PrivateRoute>
              <pages.Page title="Perfil">
                <pages.Profile />
              </pages.Page>
            </pages.PrivateRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <pages.PrivateRoute>
              <pages.Page title="Perfil">
                <pages.Profile />
              </pages.Page>
            </pages.PrivateRoute>
          }
        />

        <Route
          path="/friends"
          element={
            <pages.PrivateRoute>
              <pages.Page title="Amigos">
                <pages.Friends />
              </pages.Page>
            </pages.PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            <pages.PrivateRoute>
              <pages.Page title="Dashboard">
                <pages.Dashboard />
              </pages.Page>
            </pages.PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
