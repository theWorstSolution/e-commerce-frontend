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
            <header className='admin_header'>
                <ul className='horizontalUl mock' style={{justifyContent:'flex-end'}}>
                    <li className='admin_header_item mock'><Badge badgeContent={2} overlap="circular" sx={{ "& .MuiBadge-badge": { fontSize: 'xx-small', top: 5 } }}><NotificationsNoneIcon fontSize='small' /></Badge> Thông báo</li>
                    <li className='admin_header_item mock'><AccountCircleRoundedIcon fontSize='small' />Tài khoản</li>
                </ul>
            </header>
            <nav className='admin_tab'>
                <ul className='horizontalUl' style={{justifyContent:'space-around'}}>
                    {tabNames.map((tabName, index) => (
                        <a key={index} onClick={() => onClickTab(tabName)} style={{ textDecoration: tab === tabName ? 'none' : 'underline' }}><h2 className='mock'>{tabName}</h2></a>
                    ))}
                </ul>
            </nav>
            <article className='admin_main'>
                <section className='admin_detailSearch_panel'>
                    <h3 className='admin_detailSearch_panel_header'>DETAIL SEARCH</h3>
                    <div className='admin_detailSearch_panel_field'>
                        <div className='admin_detailSearch_panel_field_name'>Tên</div>
                        <div className='admin_detailSearch_panel_field_input'><input></input></div>
                    </div>
                </section>
                <section className='admin_main_content'>
                    <div>
                        <form className='admin_main_content_header'>
                            <input className='admin_searchbar'></input>
                            <input type='submit'></input>
                        </form>
                        <form style={{ float: 'right' }}>
                            <input type='submit'></input>
                        </form>
                    </div>

                    {result && (<div className='admin_searchResult'>
                        <ResultTable result={result} onPageChange={onPageChange} tab={tab}></ResultTable>
                    </div>)}
                </section>
            </article>
        </div>
    )
}
