import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import  productService from "../../services/productService";
import { AiOutlineEdit, AiOutlineDelete  } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import orderService from "../../services/orderService";

export default function OrderTabContent() {
    const navigate = useNavigate()
    const { setOnDetailSearchSubmit, setOnGeneralSearchSubmit, setDetailSearchForm, setPagiProps, setCurrentTab } = useOutletContext();
    const [res,setRes] = useState()
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
        
        //TODO: xem cấu trúc res để làm bảng
        setDetailSearchForm(<div><label>Tên</label>
            <input /></div>)
    }, [])
    return(<div style={{width:'100%'}}>{res && 
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
    </div>)
}