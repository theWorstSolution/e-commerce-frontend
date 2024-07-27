import logo from './logo.svg';
import './mobile.css';
import './pc.css';

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
import TestPage from './pages/TestPage';
import Cart from './pages/Cart';
import NotFoundPage from './pages/NotFoundPage';
import BuySuccess from './pages/BuySuccess';

function App() {
  return (
    <Routes>
      <Route index element={<Home/>}/>
      <Route path='auth' element={<AuthGuard/>} />
      <Route path='cart' element={<AuthGuard><Cart/></AuthGuard>} />
      <Route path='buy-success' element={<BuySuccess/>} />
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
      <Route path='test' element={<TestPage/>} />
      <Route path='*' element={<NotFoundPage/>} />
    </Routes>
  );
}

export default App;
