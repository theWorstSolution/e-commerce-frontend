import logo from './logo.svg';
import './App.css';
import Headbar from './components/Headbar'

import Router from './routes';
import { Route, Routes } from 'react-router-dom';
import AuthGuard from './guards/AuthGuard';
import Home from './pages/Home';
import AdminLayout from './pages/admin/AdminLayout';
import UserTabContent from './pages/admin/UserTabContent';
import UserDetail from './pages/admin/UserDetail';
import AdminLayout1 from './pages/admin/AdminLayout1';

function App() {
  return (
    <Routes>
      <Route path='auth' element={<AuthGuard/>} />
      <Route path=''  element={<Home/>}/>
      <Route path='admin' element={<AdminLayout1/>}>
        <Route path='users/user/:userId' element={<UserDetail/>}/>
      </Route> 
      <Route path='admin' element={<AdminLayout/>}>
        <Route path='' element={<UserTabContent/>}/>
        
        <Route path='users' element={<UserTabContent/>}/>
      </Route> 
    </Routes>
  );
}

export default App;
