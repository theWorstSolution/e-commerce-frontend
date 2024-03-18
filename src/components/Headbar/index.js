import './style.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
function Headbar(){
    return (
      <div className='mock headbar'>
        <div className='headbar_row1'>
          <span className='headbar_row1_item'><NotificationsNoneIcon fontSize='small'/>Thông báo</span>
          <span className='headbar_row1_item'><AccountCircleRoundedIcon fontSize='small'/>Tài khoản</span>
        </div>
        <div className='headbar_row2'>
          <a href='/' className='headbar_logo'>Shopee</a>
          <form className='headbar_searchbar'><input className='headbar_searchbar_input' placeholder='searchbar'/><button className='headbar_searchbar_button'><SearchRoundedIcon fontSize='small' color='primary' /></button></form>
          <div><ShoppingCartRoundedIcon fontSize='large' color='primary'/></div>
        </div>
      </div>
    )
}

export default Headbar;