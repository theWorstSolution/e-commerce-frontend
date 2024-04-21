import './style.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft, BsCart3  } from "react-icons/bs";
import { useNavigate,useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState, useRef } from "react";
const qs = require('qs')

function HomeHeader({navigateLink}){
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState()
  const onSearchInputChange = useCallback((event) => {
    setSearchInput(event.target.value)
  }, [])
  const onSearchSubmit = useCallback(async (e) => {
    e.preventDefault()
    const queryString = qs.stringify({ searchInput }, { encode: false })
    navigate(navigateLink + queryString)
  }, [searchInput])
  
    return (
      <header className='mock homeHeader'>
      <ul className='horizontalUl mock' style={{ justifyContent: 'flex-end' }}>
                    <li className='centerChildren'><BsBell />Thông báo</li>
                    <li className='centerChildren'><BsPersonCircle />Tài khoản</li>
                </ul>
        <div className='header_row2'>
          <a href='/' className='header_logo'>Shopee</a>
          <form onSubmit={onSearchSubmit} className='header_searchbar'>
            <input name='generalSearchInput' onChange={onSearchInputChange} className='header_searchbar_input' placeholder='searchbar'/>
            <button type='submit' className='header_searchbar_button'><BsSearch /></button>
          </form>
          <div><BsCart3 className='largeIcon'/></div>
        </div>
      </header>
    )
}

export default HomeHeader;