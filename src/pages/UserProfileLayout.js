import { Pagination } from '@mui/material';
import { useState, useRef } from 'react';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";
import { Outlet, Link, useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader'
import { Segmented } from 'antd';


export default function UserProfileLayout() {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState();
    const tabNames = ['Profile', 'Buy history'];
    // const tabValue = ['profile','buyHistory']
    const tabLinks = ['profile', 'buy-history']
    const options = tabNames.map((tabName, idx) => ({ label: tabName, value: tabLinks[idx] }))
    return (
        <div>
            {/* <header className='admin_header'>
                <ul className='horizontalUl mock' style={{ justifyContent: 'flex-end' }}>
                    <li className='centerChildren'><BsBell />Thông báo</li>
                    <li className='centerChildren'><BsPersonCircle />Tài khoản</li>
                </ul>
            </header> */}
            <AdminHeader logoLink={'/'} />
            <Segmented
            className='tabBar'
            style={{width:'100%'}}
                size='large'
                options={options}
                onChange={(value) => {
                    navigate('/user/' + value);
                    //   console.log(value); // string
                }}
            />
            {/* <nav className='admin_tab'>
                <ul className='horizontalUl' style={{ justifyContent: 'space-around' }}>
                    {tabNames.map((tabName, index) => (
                        <Link key={index} to={tabLinks[index]} style={{ textDecoration: currentTab === tabName ? 'none' : 'underline' }}><h2 className=''>{tabName}</h2></Link>
                    ))}
                </ul>
            </nav> */}

            <Outlet context={{ setCurrentTab }} />

        </div>
    );
}