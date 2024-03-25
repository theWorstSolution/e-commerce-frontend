import { Icon } from '@mui/material'
import './Admin.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { getUsers, getUser } from '../../services/userService';
import ResultTable from './ResultTable';


export default function Admin() {
    const [tab, setTab] = useState();
    const [result, setResult] = useState();
    function onClickTab(t) {
        console.log('set tab ' + t );
        setTab(t);
        switch (t) {
            case 'User':
                getUsers().then((response)=>{console.log(response)
                    setResult(response.data)})
                // axios.get('http://localhost:3000/v1/user/users').then((response)=>{console.log(response)
                //     setResult(response)})
                
                
        }
    }
    useEffect(()=>{
        onClickTab('User')
    },[])

    const tabNames = ['User', 'Item', 'Order']
    function onPageChange(event, page){

    }
    return (
        <div className='screen'>
            <div className='admin_header'>
                <span className='admin_header_item'><Badge badgeContent={2} overlap="circular" sx={{ "& .MuiBadge-badge": { fontSize: 'xx-small', top: 5 } }}><NotificationsNoneIcon fontSize='small' /></Badge> Thông báo</span><span className='admin_header_item'><AccountCircleRoundedIcon fontSize='small' />Tài khoản</span>
            </div>
            <div className='admin_tab'>
                {tabNames.map((tabName, index) => (
                    <a key={index} onClick={() => onClickTab(tabName)} style={{ textDecoration: tab === tabName ? 'none' : 'underline' }}>{tabName}</a>
                ))}
                {/* <a href='#' onClick={() => onClickTab('User')}>{tabName}</a><a href='#' onClick={() => onClickTab('Item')}>Item</a><a href='#' onClick={() => onClickTab('Order')}>Order</a> */}
            </div>
            <div className='admin_main'>
                <div className='admin_detailSearch_panel'>
                    <div className='admin_detailSearch_panel_header'>DETAIL SEARCH</div>
                    <div className='admin_detailSearch_panel_field'>
                        <div className='admin_detailSearch_panel_field_name'>Tên</div>
                        <div className='admin_detailSearch_panel_field_input'><input></input></div>
                    </div>
                </div>
                <div className='admin_main_content'>
                    <div className='admin_main_content_header'>
                        <span><input className='admin_searchbar'></input><span><Button sx={{ height: 25, width: 90, fontSize: 'small', marginLeft: 1 }} variant="contained" startIcon={<SearchRoundedIcon />}>Search</Button></span></span>
                        <span style={{ float: 'right' }}>Thêm</span>
                    </div>
                    {result && (<div className='admin_searchResult'>
                        <ResultTable result={result} onPageChange={onPageChange} tab={tab}></ResultTable>
                    </div>)}
                </div>
            </div>
        </div>
    )
}
