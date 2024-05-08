
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


function AdminHeader(){
  const { user } = useContext(globalContext);
  const navigate = useNavigate()
  
    return (
      <header className='mock homeHeader'>
      <ul className='horizontalUl mock' style={{ justifyContent: 'flex-end' }}>
                    <li style={{listStyleType:'none'}}><NotificationBell/></li>
                    <li className='centerChildren header_account' style={{position:'relative'}}>
                      <BsPersonCircle />{user?user.name:<p>Account</p>}
                      <div style={{position:'absolute', top:'100%'}} className='header_account_dropdown'>
                        {<nav className='header_account_nav'>
                          {user?<ul style={{listStyleType:'none', padding:0}}>
                            <li><Link to='/user'>Account detail</Link></li>
                            <li onClick={() => firebase.auth().signOut()}>Sign-out</li>
                          </ul>:<ul style={{listStyleType:'none'}}>
                            <li><Link to='/auth'>Login</Link></li>
                          </ul>}
                        </nav>}
                      </div>
                    </li>

                </ul>
        <div className='header_row2' style={{display:'flex', justifyContent:'center', marginLeft:'auto', marginRight:'auto'}}>
          <Link to='/' className='header_logo' style={{textAlign:'center'}}>Shopee</Link>
        </div>
      </header>
    )
}

export default AdminHeader;