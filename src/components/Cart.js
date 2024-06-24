
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft, BsCart3  } from "react-icons/bs";
import { Link, useNavigate,useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState, useRef, useContext } from "react";
import { globalContext } from '../contexts/globalContext';
import firebase from 'firebase/compat/app';
import NotificationBell from './NotificationBell';
const qs = require('qs')


function Cart(){
  const { user } = useContext(globalContext);
  const navigate = useNavigate()
  
    return (
        <div style={{position:'relative'}} className='cartIcon'>
        <div onClick={()=>{navigate('/cart')}}>
            <BsCart3 className='largeIcon' color='white'/>
            {user?.cart?.length && <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '-5px', right: '-4px', fontSize: '12px', borderRadius: '50%', backgroundColor: 'white', height: '12px', width: '12px' }}>
                {user.cart.length}
            </span>}</div>
        <div style={{position:'absolute', zIndex:'1', top:'100%', right:'-15px'}} className='cartDropdown'>
          <ul style={{listStyleType:'none', padding:0}} className='cartList'>
            {user?.cart?.slice(0,3).map((product)=><Link to={'/products/product/'+product.id}><li key={product.id} style={{display:'flex'}}>
              <img src={product.pictures[0]} className='productSmallThumbnail'></img>
              <div>
                <h3>{product.name}</h3>
                <p>{product.price}$</p>
              </div>
            </li></Link>)}
            {user?.cart?.length>3 && <li>{user.cart.length-3} more products</li>}
          </ul>
        </div>
      </div>
    )
}

export default Cart;