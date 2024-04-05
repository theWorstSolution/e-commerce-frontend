import { Icon  } from '@mui/material'
import './Admin.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useCallback } from 'react';
import { getUsers, getUser } from '../../services/userService';
import { BsPlus     } from "react-icons/bs";
import { FamilyRestroom } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';

import { Pagination } from '@mui/material';
import { useState, useRef } from 'react';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";


export default function AdminLayout1(){
    const [currentTab, setCurrentTab] = useState();
    let tabNames = ['User', 'Product', 'Order'];
    return (<div>
        <header className='admin_header'>
                <ul className='horizontalUl mock' style={{ justifyContent: 'flex-end' }}>
                    <li className='centerChildren'><BsBell />Thông báo</li>
                    <li className='centerChildren'><BsPersonCircle />Tài khoản</li>
                </ul>
            </header>
            <nav className='admin_tab'>
                <ul className='horizontalUl' style={{ justifyContent: 'space-around' }}>
                    {tabNames.map((tabName, index) => (
                        <a key={index} href={'/admin/' + tabName} style={{ textDecoration: currentTab === tabName ? 'none' : 'underline' }}><h2 className='mock'>{tabName}</h2></a>
                    ))}
                </ul>
            </nav>
            <Outlet context={{setCurrentTab}}/>
    </div>)
}
