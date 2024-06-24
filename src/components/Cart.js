
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft, BsCart3 } from "react-icons/bs";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState, useRef, useContext } from "react";
import { globalContext } from '../contexts/globalContext';
import firebase from 'firebase/compat/app';
import NotificationBell from './NotificationBell';
import { Popover, Button, List, Skeleton, Avatar, Badge } from "antd";
const qs = require('qs')


function Cart() {
  const { user } = useContext(globalContext);
  const navigate = useNavigate()

  const loadMore =
    user?.cart?.length > 3 ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={() => { navigate('/cart') }}>See all</Button>
      </div>
    ) : null;


  const content = <List
    style={{ width: '350px', maxHeight: '350px', overflow: 'auto' }}
    className=""
    loading={!user}
    itemLayout="horizontal"
    loadMore={loadMore}
    dataSource={user?.cart?.slice(0, 3)}
    renderItem={(item) => (
      <List.Item>
        <Skeleton title={false} loading={item.loading} active>
          <div style={{ display: 'flex' }}>
            <img src={item.pictures[0]} className='productSmallThumbnail'></img>
            <div style={{paddingLeft:'8px'}}>
              <div><Link to={'/products/product/' + item.id}>{item.name}</Link></div>
              <div>{item.price}đ</div>
            </div>
          </div>
        </Skeleton>
      </List.Item>
    )}
  />

  return (
    //   <div style={{position:'relative'}} className='cartIcon'>
    //   <div onClick={()=>{navigate('/cart')}}>
    //       <BsCart3 className='largeIcon' color='white'/>
    //       {user?.cart?.length && <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '-5px', right: '-4px', fontSize: '12px', borderRadius: '50%', backgroundColor: 'white', height: '12px', width: '12px' }}>
    //           {user.cart.length}
    //       </span>}</div>
    //   <div style={{position:'absolute', zIndex:'1', top:'100%', right:'-15px'}} className='cartDropdown'>
    //     <ul style={{listStyleType:'none', padding:0}} className='cartList'>
    //       {user?.cart?.slice(0,3).map((product)=><Link to={'/products/product/'+product.id}><li key={product.id} style={{display:'flex'}}>
    //         <img src={product.pictures[0]} className='productSmallThumbnail'></img>
    //         <div>
    //           <h3>{product.name}</h3>
    //           <p>{product.price}$</p>
    //         </div>
    //       </li></Link>)}
    //       {user?.cart?.length>3 && <li>{user.cart.length-3} more products</li>}
    //     </ul>
    //   </div>
    // </div>

    <Popover placement="bottom" content={content}>
      <div onClick={() => { navigate('/cart') }} style={{ position: 'relative', cursor: 'pointer' }}>
        <BsCart3 className='largeIcon' color='white' />
        {user?.cart?.length && <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '-5px', right: '-4px', fontSize: '12px', borderRadius: '50%', backgroundColor: 'white', height: '12px', width: '12px', color: 'var(--shopee-color)' }}>
          {user.cart.length}
        </span>}
      </div>
    </Popover>
  )
}

export default Cart;