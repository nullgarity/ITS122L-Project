import { RouteObject } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginForm from "./components/LoginForm";
import UserDashboard from "./pages/user/Dashboard";
import CreateCase from "./pages/user/CreateCase";
import MyCases from "./pages/user/MyCases";
import ViewCase from "./pages/user/ViewCase";
import ManageCase from "./pages/user/ManageCase";
import SearchCase from "./pages/user/SearchCase";
import CategoryResults from "./pages/user/CategoryResults";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminCases from "./pages/admin/AdminCases";
import ViewAdminCase from "./pages/admin/ViewCase";
import ManageAdminCase from "./pages/admin/ManageCase";
import CreateAdminCase from "./pages/admin/CreateCase";
import UserManagement from "./pages/admin/ManageUsers";
import Viewuser from "./pages/admin/ViewUser";
import Searchusers from "./pages/admin/SearchUsers";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LoginForm />,
  },
  {
    path: "/user",
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-case",
        element: (
          <ProtectedRoute>
            <CreateCase />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-cases",
        element: (
          <ProtectedRoute>
            <MyCases />
          </ProtectedRoute>
        ),
      },
      {
        path: "view-case/:id",
        element: (
          <ProtectedRoute>
            <ViewCase />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-case/:id",
        element: (
          <ProtectedRoute>
            <ManageCase />
          </ProtectedRoute>
        ),
      },
      {
        path: "search",
        element: (
          <ProtectedRoute>
            <SearchCase />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories",
        element: (
          <ProtectedRoute>
            <CategoryResults />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "cases",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminCases />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-case",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <CreateAdminCase />
          </ProtectedRoute>
        ),
      },
      {
        path: "view-case/:id",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <ViewAdminCase />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-case/:id",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <ManageAdminCase />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "view-user/:id",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <Viewuser />
          </ProtectedRoute>
        ),
      },
      {
        path: "search-users",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <Searchusers />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default routes;
