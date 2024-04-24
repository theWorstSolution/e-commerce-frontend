import logo from './logo.svg';
import './App.css';

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
import CategoryTabContent from './pages/admin/CategoryTabContent';
import EditCategory from './pages/admin/EditCategory';
import CreateCategory from './pages/admin/CreateCategory';
import ProductDetail from './pages/ProductDetail';
import UserProfileLayout from './pages/UserProfileLayout';
import UserProfile from './pages/UserProfile'
import BuyHistory from './pages/BuyHistory';

function App() {
  return (
    <Routes>
      <Route index element={<Home/>}/>
      <Route path='auth' element={<AuthGuard/>} />
      <Route path='user' element={<UserProfileLayout/>}>
        <Route index element={<UserProfile/>} />
        <Route path='profile' element={<UserProfile/>} />
        <Route path='buy-history' element={<BuyHistory/>} />
      </Route>
      <Route path='products'>
        <Route index element={<Home/>}/>
        <Route path='product/:productId' element={<ProductDetail/>}/>
      </Route>
      <Route path='admin' element={<AdminLayout/>}>
        <Route index element={<UserTabContent/>}/>   
        <Route path='users'>
          <Route index element={<UserTabContent/>}/>
          <Route path='user/:userId' element={<UserDetail/>}/>
        </Route>
        <Route path='products'>
          <Route index element={<ProductTabContent/>}/>
          <Route path='product/:productId' element={<EditProduct/>}/>
          <Route path='product' element={<CreateProduct/>}/>
        </Route>
        <Route path='orders'>
          <Route index element={<OrderTabContent/>}/>
          <Route path='order/:orderId' element={<OrderDetail/>}/>
        </Route>
        <Route path='categories'>
          <Route index element={<CategoryTabContent/>}/>
          <Route path='category/:categoryId' element={<EditCategory/>}/>
          <Route path='category' element={<CreateCategory/>}/>
        </Route>
      </Route> 
    </Routes>
  );
}

export default App;
