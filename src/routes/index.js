import { Navigate, useRoutes } from 'react-router-dom';
import AuthGuard from '../guards/AuthGuard'
import Home from '../pages/Home';
import TestPage from '../pages/TestPage';
import Admin from '../pages/admin/Admin';
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
      element: <Admin />
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