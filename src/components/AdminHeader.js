
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
import HeaderRow1 from './HeaderRow1';
import { webName } from '../config';
const qs = require('qs')


function AdminHeader({logoLink}){
  const { user } = useContext(globalContext);
  const navigate = useNavigate()
  
    return (
      <header className='homeHeader'>
      <HeaderRow1/>
        <div className='header_row2' style={{display:'flex', justifyContent:'center', marginLeft:'auto', marginRight:'auto'}}>
          <Link to={logoLink} className='header_logo' style={{textAlign:'center'}}>{webName}</Link>
        </div>
      </header>
    )
}

export default AdminHeader;