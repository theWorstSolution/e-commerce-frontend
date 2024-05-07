import './style.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft, BsCart3  } from "react-icons/bs";
import { Link, useNavigate,useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState, useRef, useContext } from "react";
import { globalContext } from '../../contexts/globalContext';
import firebase from 'firebase/compat/app';
import NotificationBell from '../NotificationBell';
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
      <header className='mock homeHeader'>
      <ul className='horizontalUl mock' style={{ justifyContent: 'flex-end' }}>
                    <li className='centerChildren'><NotificationBell/></li>
                    <li className='centerChildren header_account' style={{position:'relative'}}>
                      <BsPersonCircle />{user?user.name:<p>Account</p>}
                      <div style={{position:'absolute', top:'100%'}} className='header_account_dropdown'>
                        {<nav className='header_account_nav'>
                          {user?<ul style={{listStyleType:'none', padding:0}}>
                            <li><Link to='/user'>Account detail</Link></li>
                            <li onClick={() => firebase.auth().signOut()}>Sign-out</li>
                          </ul>:<ul style={{listStyleType:'none', padding:0}}>
                            <li><Link to='/auth'>Login</Link></li>
                          </ul>}
                        </nav>}
                      </div>
                    </li>

                </ul>
        <div className='header_row2'>
          <Link to='/' className='header_logo'>Shopee</Link>
          <form onSubmit={onSearchSubmit} className='header_searchbar'>
            <input name='generalSearchInput' onChange={onSearchInputChange} className='header_searchbar_input' placeholder='searchbar'/>
            <button type='submit' className='header_searchbar_button'><BsSearch /></button>
          </form>
          <div style={{position:'relative'}} className='cartIcon'>
            <Link to='/cart'><BsCart3 className='largeIcon'/></Link>
            <div style={{position:'absolute', zIndex:'1', top:'100%', right:'-15px'}} className='cartDropdown'>
              <ul style={{listStyleType:'none', padding:0}} className='cartList'>
                {user?.cart.slice(0,3).map((product)=><Link to={'/products/product/'+product.id}><li key={product.id} style={{display:'flex'}}>
                  <img src={product.pictures[0]} className='productSmallThumbnail'></img>
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.price}$</p>
                  </div>
                </li></Link>)}
                {user?.cart.length>3 && <li>{user.cart.length-3} more products</li>}
              </ul>
            </div>
          </div>
        </div>
      </header>
    )
}

export default HomeHeader;