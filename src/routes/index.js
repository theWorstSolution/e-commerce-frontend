import { Navigate, useRoutes } from 'react-router-dom';
import AuthGuard from '../guards/AuthGuard'
import Home from '../pages/Home';
import TestPage from '../pages/TestPage';
import AdminLayout from '../pages/admin/AdminLayout';
import UserTabContent from '../pages/admin/UserTabContent';
export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <AuthGuard />
          ),
        },
      ],
    },
    {
      path: 'admin',
      element: <AdminLayout />,
      children:[
        {element: <Navigate to='user' replace/>, index:true},
        {
          path:'user',
          element:(<UserTabContent/>)
        }
      ]
    },
    {
      path: 'test',
      element: (
        <AuthGuard>
          <TestPage />
        </AuthGuard>
      )
    },
    {
      path: '',
      element: <Home />
    }
  ]);
}