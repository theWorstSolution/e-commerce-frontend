import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../services/userService";
import orderService from "../../services/orderService";

export default function OrderDetail(){
    const {orderId} = useParams()
    const {setCurrentTab} = useOutletContext()
    const [order,setOrder] = useState()
    const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    alert(inputs);
    orderService.updateOrder(orderId, inputs).then((res)=>console.log(res))
  }


    useEffect(()=>{
        setCurrentTab('Orders')
        orderService.getOrder(orderId).then((res)=>{
            setOrder(res.data)
            console.log(res.data);
        })
    },[])
    return(<div>{order?<article>
        <form style={{display:'flex', flexDirection:'column'}} onSubmit={handleSubmit}>
            <label>Id</label>
            <input type="text" readOnly defaultValue={order.id}/>
            <label>User</label>
            <a href={"/admin/users/user/"+order.user.id}>{order.user.id + ' - ' + order.user.name}</a>
            <label>Product</label>
            <a href={"/admin/products/product/"+order.product.id}>{order.product.id + ' - ' + order.product.name}</a>
            <label>Amount</label>
            <input type="number" readOnly defaultValue={order.amount}/>
            <label>Product price</label>
            <input type="number" readOnly defaultValue={order.productPrice}/>
            <label>Delivery fee</label>
            <input type="number" readOnly defaultValue={order.deliveryFee}/>
            <label>Status</label>
            <select defaultValue={order.status} name="status" onChange={handleChange}>
                <option value='onGoing' >On going</option>
                <option value='canceled' >Canceled</option>
                <option value='delivered' >Delivered</option>
            </select>
            <label>Has Paid?</label>
            <select defaultValue={order.hasPaid} name="hasPaid" onChange={handleChange}>
                <option value={0} >No</option>
                <option value={1} >Yes</option>
            </select>
            <input type="submit"/>
        </form>
    </article>:'Loading'}</div>)
}