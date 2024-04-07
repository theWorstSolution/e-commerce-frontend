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
import CreateProduct from './pages/admin/CreateProduct';
import ProductTabContent from './pages/admin/ProductTabContent';
import EditProduct from './pages/admin/EditProduct';
import OrderTabContent from './pages/admin/OrderTabContent';
import OrderDetail from './pages/admin/OrderDetail';

function App() {
  return (
    <Routes>
      <Route path='auth' element={<AuthGuard/>} />
      <Route path=''  element={<Home/>}/>
      <Route path='admin' element={<AdminLayout1/>}>
        <Route path='users/user/:userId' element={<UserDetail/>}/>
        <Route path='products/product/:productId' element={<EditProduct/>}/>
        <Route path='products/product' element={<CreateProduct/>}/>
        <Route path='orders/order/:orderId' element={<OrderDetail/>}/>
      </Route> 
      <Route path='admin' element={<AdminLayout/>}>
        <Route path='' element={<UserTabContent/>}/>   
        <Route path='users' element={<UserTabContent/>}/>
        <Route path='products' element={<ProductTabContent/>}/>
        <Route path='orders' element={<OrderTabContent/>}/>
      </Route> 
    </Routes>
  );
}

export default App;
