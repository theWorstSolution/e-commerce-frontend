import AdminHeader from "../components/AdminHeader";
import { useContext, useState } from "react";
import { globalContext } from "../contexts/globalContext";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import userService from "../services/userService";
import orderService from "../services/orderService";

export default function Cart() {
    const { user, setUser } = useContext(globalContext);
    const [quantityList, setQuantityList] = useState(new Array(user.cart.length).fill(1));
    const [checkedList, setCheckedList] = useState(new Array(user.cart.length).fill(false));
    function buy(){
        const buyList = user.cart.map((product,idx)=>({...product, amount:quantityList[idx]})).filter((product,idx)=>checkedList[idx])
        let confirmStr = ''
        let totalPrice = 0;
        for(let product of buyList){
            confirmStr += product.name + '\t' + product.amount + '\t' + product.price + '\t' + product.amount*product.price + '\n'
            totalPrice += product.amount*product.price
        }
        const isConfirmed = window.confirm('Product\tAmount\tUnit price\tTotal price\n'+ confirmStr + 
            '==================================\n'+
            '\t\t\t\t\tTotal: ' + totalPrice + '\n'+
            'confirm?')

        if(isConfirmed){
            const body = {
                userId: user.uid,
                buyList: buyList.map((product)=>({productId:product.id, amount:product.amount}))
            }
            orderService.createOrders(body).then(({data})=>{
                console.log(data)
                userService.updateUser(user.uid, { cart: [...user.cart.filter((prdct, idx)=>!checkedList[idx]).map((product) => product.id)] }).then(({ data }) => {
                    console.log(data);
                    const newUser = { ...user }
                    newUser.cart = newUser.cart.filter((prdct, idx)=>!checkedList[idx])
                    setUser(newUser)
                    quantityList.filter((prdct,idx)=>!checkedList[idx])
                    checkedList.filter((isChecked)=>!isChecked)
                })
                if(data){
                    alert('Buy successfully')
                }
            })
        }
    }
    return (<div>
        <AdminHeader logoLink={'/'} />
        <table>
            <tr><th>Product</th><th>Unit price</th><th>Quantity</th><th>Total price</th><th>Action</th></tr>
            {user.cart.map((product, idx) => <tr key={product.id}>
                <td style={{ display: 'flex' }}>
                    <img src={product.pictures[0]} className='productSmallThumbnail'></img>
                    <h3>{product.name}</h3>
                </td>
                <td>{product.price}</td>
                <td>
                    <input type='number' min={1} value={quantityList[idx]} onChange={(e) => {
                        const newQuantityList = [...quantityList]
                        newQuantityList[idx] = e.target.value
                        setQuantityList(newQuantityList)
                    }} />
                </td>
                <td>{quantityList[idx] * product.price}</td>
                <td>
                    <input type="checkbox" checked={checkedList[idx]} onChange={(e) => {
                        const newCheckedList = [...checkedList]
                        newCheckedList[idx] = e.target.checked
                        setCheckedList(newCheckedList)
                    }} />
                    <button onClick={() => {
                        userService.updateUser(user.uid, { cart: [...user.cart.filter((prdct) => prdct.id != product.id).map((product) => product.id)] }).then(({ data }) => {
                            console.log(data);
                            const newUser = { ...user }
                            newUser.cart = newUser.cart.filter((prdct) => prdct.id != product.id)
                            setUser(newUser)
                            quantityList.splice(idx,1)
                            checkedList.splice(idx,1)
                        })
                    }}><AiOutlineDelete /></button>
                </td>
            </tr>)}
        </table>
        <button type="submit" onClick={buy}>Buy</button>
    </div>)
}