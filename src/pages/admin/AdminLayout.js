import { Pagination } from '@mui/material';
import { useState, useRef } from 'react';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader'



export default function AdminLayout() {
    const [currentTab, setCurrentTab] = useState(); 
    const tabNames = ['Users', 'Products', 'Categories', 'Orders'];
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
                        <a key={index} href={'/admin/' + tabName} style={{ textDecoration: currentTab === tabName ? 'none' : 'underline' }}><h2 className='mock'>{tabName}</h2></a>
                    ))}
                </ul>
            </nav>
            
            <Outlet context={{setCurrentTab}} />
                    
        </div>
    );
}
