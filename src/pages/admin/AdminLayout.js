import { Pagination } from '@mui/material';
import { useState, useRef } from 'react';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";
import { Outlet } from 'react-router-dom';




export default function AdminLayout() {
    //             getUsers().then((response) => {
    //                 console.log(response)
    //                 setResult(response.data)
    //             })

    const [currentTab, setCurrentTab] = useState();
    const [detailSearchForm, setDetailSearchForm] = useState();
    let [onDetailSearchSubmit, setOnDetailSearchSubmit] = useState();
    let [onGeneralSearchSubmit, setOnGeneralSearchSubmit] = useState();
    let [onAdd,setOnAdd] = useState();
    const [pagiProps, setPagiProps] = useState({
        boundaryCount: 1, //Number of always visible pages at the beginning and end.
        count: 1, // total page
        hideNextButton: false,
        hidePrevButton: false,
        onChange: null,
        page: 1, //current page
    });
    let tabNames = ['Users', 'Products', 'Orders'];
    return (
        <div>
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
            <article className='admin_main'>
                <section>
                    <h3 style={{ textAlign: 'center' }}>DETAIL SEARCH</h3>
                    <form onSubmit={onDetailSearchSubmit}>
                        {detailSearchForm}
                        <button type='submit' style={{ display: 'flex' }}>Submit</button>
                    </form>
                </section>
                <section className='admin_main_content'>
                    <div>
                        <form onSubmit={onGeneralSearchSubmit} style={{ display: 'flex', justifyContent: 'center' }}>
                            <input />
                            <button type='submit' style={{ display: 'flex' }}><BsSearch /></button>
                        </form>
                        {currentTab!=='User' && <button onClick={onAdd} style={{ marginLeft: 'auto', marginRight: 0, display: 'flex' }}><BsPlusLg /></button>}
                    </div>

                    <div className='centerChildren'>
                        <Outlet context={{ setOnDetailSearchSubmit, setOnGeneralSearchSubmit, setOnAdd, setDetailSearchForm, setPagiProps, setCurrentTab }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} style={{ marginRight: '5px' }} /></div>

                </section>
            </article>
        </div>
    );
}
