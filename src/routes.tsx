import { RouteObject } from 'react-router-dom';

import Login from './pages/Login';
import UserDashboard from './pages/user/Dashboard';
import CreateCase from './pages/user/CreateCase';
import MyCases from './pages/user/MyCases';
import ViewCase from './pages/user/ViewCase';
import ManageCase from './pages/user/ManageCase';
import SearchCase from './pages/user/SearchCase';
import CategoryResults from './pages/user/CategoryResults';

import AdminDashboard from './pages/admin/Dashboard';
import AdminCases from './pages/admin/AdminCases';
import ViewAdminCase from './pages/admin/ViewCase';
import ManageAdminCase from './pages/admin/ManageCase';
import CreateAdminCase from './pages/admin/CreateCase';
import UserManagement from './pages/admin/ManageUsers';
import Viewuser from './pages/admin/ViewUser';
import Searchusers from './pages/admin/SearchUsers';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/user',
    children: [
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'create-case', element: <CreateCase /> },
      { path: 'my-cases', element: <MyCases /> },
      { path: 'view-case/:id', element: <ViewCase /> },
      { path: 'manage-case/:id', element: <ManageCase /> },
      { path: 'search', element: <SearchCase /> },
      { path: 'categories', element: <CategoryResults /> },
    ],
  },
  {
    path: '/admin',
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'cases', element: <AdminCases /> },
      { path: 'create-case', element: <CreateAdminCase /> },
      { path: 'view-case/:id', element: <ViewAdminCase /> },
      { path: 'manage-case/:id', element: <ManageAdminCase /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'view-user/:id', element: <Viewuser /> },
      { path: 'search-users', element: <Searchusers /> },
    ],
  },
];

export default routes;