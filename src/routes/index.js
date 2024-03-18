import { Navigate, useRoutes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import SignInScreen from '../pages/auth/SignInScreen'
import Home from '../pages/Home';
import TestPage from '../pages/TestPage';

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <SignInScreen />
          ),
        },
      ],
    },
    {
      path: 'test',
      element: (
        <SignInScreen>
          <TestPage />
        </SignInScreen>
      )
    },
    {
      path: '',
      element: <Home />
    }
  ]);
}