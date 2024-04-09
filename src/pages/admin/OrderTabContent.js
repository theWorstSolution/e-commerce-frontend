import { useEffect, useState,useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import  productService from "../../services/productService";
import { AiOutlineEdit, AiOutlineDelete  } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import orderService from "../../services/orderService";
import { Pagination } from '@mui/material';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";

export default function OrderTabContent() {
    const navigate = useNavigate()
    const {setCurrentTab } = useOutletContext();
    const [res,setRes] = useState()
    const [pagiProps, setPagiProps] = useState({
        boundaryCount: 1, //Number of always visible pages at the beginning and end.
        count: 1, // total page
        hideNextButton: false,
        hidePrevButton: false,
        onChange: null,
        page: 1, //current page
    });
    useEffect(() => {
        setCurrentTab('Orders')
        orderService.getOrders().then((response) => {
            console.log(response)
            setRes(response.data.results)
            setPagiProps((pagiProps)=>({
                ...pagiProps,
                count: response.data.totalPages,
                page: response.data.page
            }))
        })
        
    }, [])
    const onGeneralSearchSubmit = useCallback(()=>{},[])
    const onDetailSearchSubmit = useCallback(()=>{},[])
    return(
    <article className='admin_main'>
    <section>
        <h3 style={{ textAlign: 'center' }}>DETAIL SEARCH</h3>
        <form onSubmit={onDetailSearchSubmit}>
            
            <button type='submit' style={{ display: 'flex' }}>Submit</button>
        </form>
    </section>
    <section className='admin_main_content'>
        <div>
            <form onSubmit={onGeneralSearchSubmit} style={{ display: 'flex', justifyContent: 'center' }}>
                <input />
                <button type='submit' style={{ display: 'flex' }}><BsSearch /></button>
            </form>
        </div>

        <div className='centerChildren'>
        {res && 
    <table style={{width:'100%'}}>
        <thead>
            <tr>
                <th style={{width:'30%'}}>Id</th><th>User</th><th>Product</th><th>Total Cost</th><th>Status</th><th>Has Paid?</th><th>Option</th>
            </tr>
        </thead>
        <tbody>
            {res.map((order)=>(<tr key={order.id}><td>{order.id}</td><td><a href={"/admin/users/user/"+order.user.id}>{order.user.name}</a></td><td><a href={'/admin/products/product/'+order.product.id}>{order.product.name}</a></td><td>{order.deliveryFee + order.productPrice*order.amount}</td><td>{order.status}</td><td>{order.hasPaid}</td>
            <td className="centerChildren"><button className="centerChildren" onClick={()=>{navigate('/admin/orders/order/'+order.id)}}><AiOutlineEdit /></button></td></tr>))}
        </tbody>
    </table>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} style={{ marginRight: '5px' }} /></div>

    </section>
</article>)
}