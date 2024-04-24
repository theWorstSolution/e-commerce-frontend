import { Pagination } from '@mui/material';
import { useState, useRef } from 'react';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";
import { Outlet, Link } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader'


export default function UserProfileLayout(){
    const [currentTab, setCurrentTab] = useState(); 
    const tabNames = ['Profile', 'Buy history'];
    const tabLinks = ['profile', 'buy-history']
    return (
        <div>
            {/* <header className='admin_header'>
                <ul className='horizontalUl mock' style={{ justifyContent: 'flex-end' }}>
                    <li className='centerChildren'><BsBell />Thông báo</li>
                    <li className='centerChildren'><BsPersonCircle />Tài khoản</li>
                </ul>
            </header> */}
            <AdminHeader/>
            <nav className='admin_tab'>
                <ul className='horizontalUl' style={{ justifyContent: 'space-around' }}>
                    {tabNames.map((tabName, index) => (
                        <Link key={index} to={tabLinks[index]} style={{ textDecoration: currentTab === tabName ? 'none' : 'underline' }}><h2 className='mock'>{tabName}</h2></Link>
                    ))}
                </ul>
            </nav>
            
            <Outlet context={{setCurrentTab}} />
                    
        </div>
    );
}