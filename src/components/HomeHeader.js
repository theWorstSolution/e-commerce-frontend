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
import Cart from './Cart';
import AccountDropdown from './AccountDropdown';
import HeaderRow1 from './HeaderRow1';
const qs = require('qs')


function HomeHeader({navigateLinkOnSearch}){
  const { user } = useContext(globalContext);
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState()
  const onSearchInputChange = useCallback((event) => {
    setSearchInput(event.target.value)
  }, [])
  const onSearchSubmit = useCallback(async (e) => {
    e.preventDefault()
    const queryString = qs.stringify({ generalSearchInput: searchInput }, { encode: false })
    navigate(navigateLinkOnSearch + queryString)
  }, [searchInput])
  
    return (
      <header className='homeHeader'>
      <HeaderRow1/>
        <div className='header_row2'>
          <Link to='/' className='header_logo'>Shopee</Link>
          <form onSubmit={onSearchSubmit} className='header_searchbar'>
            <input name='generalSearchInput' onChange={onSearchInputChange} className='header_searchbar_input' placeholder='Search for products'/>
            <button type='submit' className='header_searchbar_button'><BsSearch /></button>
          </form>
          <Cart/>
        </div>
      </header>
    )
}

export default HomeHeader;