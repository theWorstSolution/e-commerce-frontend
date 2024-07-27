
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
import utils from '../utils/utils';
const qs = require('qs')


function AdminHeader({logoLink}){
  const { user, screenSize } = useContext(globalContext);
  const navigate = useNavigate()
  
    return (
      <header className='homeHeader' style={{paddingBottom:0}}>
      <HeaderRow1 style={utils.getResponsiveValue(screenSize,{marginBottom:'0.5em'},{})}/>
        <div className='header_row2' style={{display:'flex', justifyContent:'center', marginLeft:'auto', marginRight:'auto'}}>
          {screenSize.isPc && <Link to={logoLink} className='header_logo' style={{textAlign:'center'}}>{webName}</Link>}
        </div>
      </header>
    )
}

export default AdminHeader;