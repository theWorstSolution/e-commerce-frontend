
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
import { Dropdown } from 'antd';
const qs = require('qs')


const loginedItems = [
  {
    label: (
      <Link to='/user' style={{ textDecoration: 'none' }}>Account detail</Link>
    ),
    key: '0',
  },
  // {
  //   type: 'divider',
  // },
  {
    label: (
      <a style={{ textDecoration: 'none' }} onClick={() => firebase.auth().signOut()}>
        Sign-out
      </a>
    ),
    key: '1',
  },
];

const guestItems = [
  {
    label: (
      <Link to='/auth'>Login</Link>
    ),
    key: '0',
  }
];

function AccountDropdown() {
  const { user } = useContext(globalContext);
  

  return (
        <Dropdown
          menu={user?{items:loginedItems}:{items:guestItems}}
          placement="bottom"
        arrow
        >
          <div className='centerChildren' style={{cursor:'default'}}><BsPersonCircle className='headerIcon'/><span>{user?user.name:'Account'}</span></div>
        </Dropdown>
  )
}

export default AccountDropdown;