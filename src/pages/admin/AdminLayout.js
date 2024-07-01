import { Pagination } from '@mui/material';
import { useState, useRef, useContext } from 'react';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";
import { Link, Outlet } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader'
import { globalContext } from '../../contexts/globalContext';
import NotFoundPage from '../NotFoundPage';



export default function AdminLayout() {
    const { user } = useContext(globalContext);
    const [currentTab, setCurrentTab] = useState(); 
    const tabNames = ['Users', 'Products', 'Categories', 'Orders'];
    if(!user || user.role!='admin'){
        return(<NotFoundPage/>)
    }
    return (
        <div>
            {/* <header className='admin_header'>
                <ul className='horizontalUl mock' style={{ justifyContent: 'flex-end' }}>
                    <li className='centerChildren'><BsBell />Thông báo</li>
                    <li className='centerChildren'><BsPersonCircle />Tài khoản</li>
                </ul>
            </header> */}
            <AdminHeader logoLink={'/admin'}/>
            <nav className='admin_tab'>
                <ul className='horizontalUl' style={{ justifyContent: 'space-around' }}>
                    {tabNames.map((tabName, index) => (
                        <Link key={index} to={'/admin/' + tabName} style={{ textDecoration: currentTab === tabName ? 'none' : 'underline' }}><h2 className=''>{tabName}</h2></Link>
                    ))}
                </ul>
            </nav>
            
            <Outlet context={{setCurrentTab}} />
                    
        </div>
    );
}
