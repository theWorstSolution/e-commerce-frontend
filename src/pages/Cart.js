import AdminHeader from "../components/AdminHeader";
import { useContext, useState } from "react";
import { globalContext } from "../contexts/globalContext";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import userService from "../services/userService";
import orderService from "../services/orderService";
import { Button, InputNumber, Modal, message } from "antd";
import { Link } from "react-router-dom";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import utils from "../utils/utils";

export default function Cart() {
    const { user, setUser, screenSize } = useContext(globalContext);
    const [quantityList, setQuantityList] = useState(new Array(user.cart.length).fill(1));
    const [checkedList, setCheckedList] = useState(new Array(user.cart.length).fill(false));
    const [isModalOpen, setIsModalOpen] = useState(false);
    let buyList;
    function genConfirmMessage() {
        buyList = user.cart.map((product, idx) => ({ ...product, amount: quantityList[idx] })).filter((product, idx) => checkedList[idx])
        let totalPrice = 0
        for (let product of buyList) {
            totalPrice += product.amount * product.price
        }



        return (<table>
            <thead><tr><th>Product</th><th>Amount</th>
                <th>Unit price</th><th>Total price</th>
            </tr></thead>

            <tbody>
                {buyList.map((product) => <tr>
                    <td>{product.name}</td><td>{product.amount}</td>
                    <td>{product.price.toLocaleString('de-DE')}đ</td><td>{(product.amount * product.price).toLocaleString('de-DE')}đ</td>
                </tr>)}
                <tr><td colSpan={3} style={{ textAlign: 'center', borderTop: 'solid black' }}><strong>Total</strong></td><td style={{ borderTop: 'solid black' }}>{totalPrice.toLocaleString('de-DE')}đ</td></tr>
            </tbody>

        </table>)
    }
    return (<div>
        <AdminHeader logoLink={'/'} />
        <section className="sectionCard">
            {screenSize.isMobile && user.cart.map((product, idx) => <div className='cartItem'>
                <div style={{borderBottom:'solid rgba(0, 0, 0, .5) 1px'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                        <div><span style={{marginRight:'0.5em'}}>Buy</span> <input style={{ transform: 'scale(2.5)' }} type="checkbox" checked={checkedList[idx]} onChange={(e) => {
                                const newCheckedList = [...checkedList]
                                newCheckedList[idx] = e.target.checked
                                setCheckedList(newCheckedList)
                            }} />
                        </div>

                        <div><span style={{marginRight:'0.5em'}}>Remove</span> 
                            <Button danger icon={<AiOutlineDelete />} onClick={() => {
                                userService.updateUser(user.uid, { cart: [...user.cart.filter((prdct) => prdct.id != product.id).map((product) => product.id)] }).then(({ data }) => {
                                    console.log(data);
                                    const newUser = { ...user }
                                    newUser.cart = newUser.cart.filter((prdct) => prdct.id != product.id)
                                    setUser(newUser)
                                    quantityList.splice(idx, 1)
                                    checkedList.splice(idx, 1)
                                })
                            }} />
                        </div>
                    </div>
                    <div style={{margin:'0.5em 0'}}><Link style={{ textDecoration: 'none' }} to={'/products/product/' + product.id}>{product.name}</Link></div>
                </div>
                <div style={{display:'flex', marginTop:'0.5em'}}>
                    <div><img src={product.pictures[0]} className='productSmallThumbnail'></img></div>
                        <div style={{marginLeft:'0.5em', display:'flex', flexDirection:'column', justifyContent:'center', gap:'0.5em'}}>
                            <div>Price: {product.price.toLocaleString('de-DE')}đ</div>
                            <div style={{display:'flex', alignItems:'center'}}><div>Quantity: </div><InputNumber style={{ width: '50%' }} className="amountInput"
                                controls={false}
                                // addonBefore={<div style={{cursor:'pointer'}} onClick={()=>{setAmountValue((amountValue)=>--amountValue)}}>-</div>} 
                                addonBefore={<div className="centerChildren" style={{ cursor: quantityList[idx] == 1 ? 'not-allowed' : 'pointer', padding: '11px' }} onClick={quantityList[idx] == 1 ? null : () => {
                                    const newQuantityList = [...quantityList]
                                    newQuantityList[idx] = newQuantityList[idx] - 1
                                    setQuantityList(newQuantityList)
                                }}><BsDashLg /></div>}

                                addonAfter={<div className="centerChildren" style={{ cursor: 'pointer', padding: '11px' }} onClick={() => {
                                    const newQuantityList = [...quantityList]
                                    newQuantityList[idx] = newQuantityList[idx] + 1
                                    setQuantityList(newQuantityList)
                                }}><BsPlusLg /></div>}
                                value={quantityList[idx]} min={1}
                                onChange={(value) => {
                                    const newQuantityList = [...quantityList]
                                    newQuantityList[idx] = value
                                    setQuantityList(newQuantityList)
                                }}
                            /></div>
                            <div>Total price: {(quantityList[idx] * product.price).toLocaleString('de-DE')}đ</div>
                        </div>
                </div>
            </div>)}

            {screenSize.isPc && <table className="cartTable">
                <thead><tr><th style={{ width: '50%' }}>Product</th><th>Unit price</th><th style={{ width: '230px' }}>Quantity</th><th>Total price</th><th>Buy</th><th>Delete</th></tr></thead>
                <tbody>
                    {user.cart.map((product, idx) => <tr key={product.id}>
                        <td style={{ display: 'flex', gap: '10px' }}>
                            <img src={product.pictures[0]} className='productSmallThumbnail'></img>
                            <Link style={{ textDecoration: 'none' }} to={'/products/product/' + product.id}>{product.name}</Link>
                        </td>
                        <td>{product.price.toLocaleString('de-DE')}đ</td>
                        <td>
                            <InputNumber style={{ width: '50%' }} className="amountInput"
                                controls={false}
                                // addonBefore={<div style={{cursor:'pointer'}} onClick={()=>{setAmountValue((amountValue)=>--amountValue)}}>-</div>} 
                                addonBefore={<div className="centerChildren" style={{ cursor: quantityList[idx] == 1 ? 'not-allowed' : 'pointer', padding: '11px' }} onClick={quantityList[idx] == 1 ? null : () => {
                                    const newQuantityList = [...quantityList]
                                    newQuantityList[idx] = newQuantityList[idx] - 1
                                    setQuantityList(newQuantityList)
                                }}><BsDashLg /></div>}

                                addonAfter={<div className="centerChildren" style={{ cursor: 'pointer', padding: '11px' }} onClick={() => {
                                    const newQuantityList = [...quantityList]
                                    newQuantityList[idx] = newQuantityList[idx] + 1
                                    setQuantityList(newQuantityList)
                                }}><BsPlusLg /></div>}
                                value={quantityList[idx]} min={1}
                                onChange={(value) => {
                                    const newQuantityList = [...quantityList]
                                    newQuantityList[idx] = value
                                    setQuantityList(newQuantityList)
                                }}
                            />

                            {/* <input type='number' min={1} value={quantityList[idx]} onChange={(e) => {
                                const newQuantityList = [...quantityList]
                                newQuantityList[idx] = e.target.value
                                setQuantityList(newQuantityList)
                            }} /> */}
                        </td>
                        <td>{(quantityList[idx] * product.price).toLocaleString('de-DE')}đ</td>
                        <td>
                            <input style={{ transform: 'scale(2.5)' }} type="checkbox" checked={checkedList[idx]} onChange={(e) => {
                                const newCheckedList = [...checkedList]
                                newCheckedList[idx] = e.target.checked
                                setCheckedList(newCheckedList)
                            }} />
                        </td>
                        <td>
                            <Button danger icon={<AiOutlineDelete />} onClick={() => {
                                userService.updateUser(user.uid, { cart: [...user.cart.filter((prdct) => prdct.id != product.id).map((product) => product.id)] }).then(({ data }) => {
                                    console.log(data);
                                    const newUser = { ...user }
                                    newUser.cart = newUser.cart.filter((prdct) => prdct.id != product.id)
                                    setUser(newUser)
                                    quantityList.splice(idx, 1)
                                    checkedList.splice(idx, 1)
                                })
                            }} />
                            {/* <button onClick={() => {
                                userService.updateUser(user.uid, { cart: [...user.cart.filter((prdct) => prdct.id != product.id).map((product) => product.id)] }).then(({ data }) => {
                                    console.log(data);
                                    const newUser = { ...user }
                                    newUser.cart = newUser.cart.filter((prdct) => prdct.id != product.id)
                                    setUser(newUser)
                                    quantityList.splice(idx,1)
                                    checkedList.splice(idx,1)
                                })
                            }}><AiOutlineDelete /></button> */}
                        </td>
                    </tr>)}
                </tbody>
            </table>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '20px', paddingRight: '20px' }}>
                <Button size="large" type='primary' onClick={() => setIsModalOpen(true)}>Buy</Button>
                <Modal title="Confirm buy" open={isModalOpen}
                    okText='Pay via Zalopay'
                    onOk={() => {
                        message.loading('Action in progress..');
                        const body = {
                            userId: user.uid,
                            buyList: buyList.map((product) => ({ productId: product.id, amount: product.amount }))
                        }
                        orderService.createOrders(body).then(({ data: payUrl }) => {
                            userService.updateUser(user.uid, { cart: [...user.cart.filter((prdct, idx) => !checkedList[idx]).map((product) => product.id)] }).then(({ data }) => {
                                // console.log(data);
                                // const newUser = { ...user }
                                // newUser.cart = newUser.cart.filter((prdct, idx)=>!checkedList[idx])
                                // setUser(newUser)
                                // quantityList.filter((prdct,idx)=>!checkedList[idx])
                                // checkedList.filter((isChecked)=>!isChecked)
                            })
                            window.location.href = payUrl;
                        })
                    }}
                    onCancel={() => { setIsModalOpen(false) }}>
                    {genConfirmMessage()}
                </Modal>
            </div>
        </section>
    </div>)
}