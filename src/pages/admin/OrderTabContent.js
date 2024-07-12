import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import productService from "../../services/productService";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useNavigate, useSearchParams } from 'react-router-dom';
import orderService from "../../services/orderService";
import { Pagination } from '@mui/material';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";
const qs = require('qs')

export default function OrderTabContent() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const { setCurrentTab } = useOutletContext();
    const [res, setRes] = useState()
    const [pagiProps, setPagiProps] = useState({
        boundaryCount: 1, //Number of always visible pages at the beginning and end.
        count: 1, // total page
        hideNextButton: false,
        hidePrevButton: false,
        onChange: null,
        page: 1, //current page
    });
    // useEffect(() => {
    //     setCurrentTab('Orders')
    //     orderService.getOrders().then((response) => {
    //         console.log(response)
    //         setRes(response.data.results)
    //         setPagiProps((pagiProps)=>({
    //             ...pagiProps,
    //             count: response.data.totalPages,
    //             page: response.data.page
    //         }))
    //     })

    // }, [])
    useEffect(() => {
        setCurrentTab('Orders')
        const initialGeneralSearchInput = searchParams.get('generalSearchInput')
        console.log(initialGeneralSearchInput);
        const initialPage = searchParams.get('page')
        let filter, options;
        if (searchParams.size == 0 || (searchParams.size == 1 && initialPage && initialPage!= '')) {
            filter = {}
            options = { page: initialPage }
        } else if (initialGeneralSearchInput) {
            filter = {
                _id: initialGeneralSearchInput
            }
            options = { page: initialPage }
        } else {
            filter = {
                amount: {}, totalPrice: {}, $and: []
            }
            if (searchParams.get('userId') && searchParams.get('userId') != '') {
                filter.user = searchParams.get('userId')
            }
            if (searchParams.get('productId') && searchParams.get('productId') != '') {
                filter.product = searchParams.get('productId')
            }
            if (searchParams.get('minAmount') && searchParams.get('minAmount') != '') {
                filter.amount.$gte = searchParams.get('minAmount')
            }
            if (searchParams.get('maxAmount') && searchParams.get('maxAmount') != '') {
                filter.amount.$lte = searchParams.get('maxAmount')
            }
            if (searchParams.get('minTotalCost') && searchParams.get('minTotalCost') != '') {
                let $expr = { $gte: [{ $add: ["$deliveryFee", "$totalPrice"] }, { $toInt: searchParams.get('minTotalCost') }] }
                filter.$and.push({ $expr })
            }
            if (searchParams.get('maxTotalCost') && searchParams.get('maxTotalCost') != '') {
                let $expr = { $lte: [{ $add: ["$deliveryFee", "$totalPrice"] }, { $toInt: searchParams.get('maxTotalCost') }] }
                filter.$and.push({ $expr })
            }

            filter.status = searchParams.get('status')
            filter.hasPaid = searchParams.get('hasPaid')

            options = { sortBy: searchParams.get('sortField') + ':' + searchParams.get('sortOrder'), page: initialPage }
        }
        options.populate = 'user,product'
        console.log(filter);
        console.log(options);
        orderService.getOrders(filter, options).then(({ data }) => {
            console.log(data);
            setRes(data.results)
            setPagiProps((pagiProps) => ({
                ...pagiProps,
                count: data.totalPages,
                page: data.page
            }))
        })
    }, [searchParams])
    const onChangePage = useCallback(async (event, page) => {
        setSearchParams((params) => {
            params.set("page", page)
            return params
        });
    }, [])
    const [detailSearchInput, setDetailSearchInput] = useState({sortField:'createdAt', sortOrder:'desc', hasPaid:1, status:'delivered'})
    const onDetailSearchInputChange = useCallback((event) => {
        const name = event.target.name;
        const value = event.target.value;
        setDetailSearchInput(values => ({ ...values, [name]: value }))
    }, [])
    const onDetailSearchSubmit = useCallback((e) => { 
        e.preventDefault()
        const queryString = qs.stringify(detailSearchInput, { encode:false})
        navigate('/admin/orders?'+queryString)
    }, [detailSearchInput])
    return (
        <article className='admin_main'>
            <section>
                <h3 style={{ textAlign: 'center' }}>DETAIL SEARCH</h3>
                <form onSubmit={onDetailSearchSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>User id</label>
                    <input type='search' name="userId" onChange={onDetailSearchInputChange}/>
                    <label>Product id</label>
                    <input type='search' name="productId" onChange={onDetailSearchInputChange}/>
                    <label>Amount</label>
                    <input type='number' name="minAmount" onChange={onDetailSearchInputChange}/>
                    <input type='number' name="maxAmount" onChange={onDetailSearchInputChange}/>
                    <label>Total cost</label>
                    <input type='number' name="minTotalCost" onChange={onDetailSearchInputChange}/>
                    <input type='number' name="maxTotalCost" onChange={onDetailSearchInputChange}/>
                    <label>Status</label>
                    <select defaultValue={'delivered'} name="status" onChange={onDetailSearchInputChange}>
                        <option value='onGoing' >On going</option>
                        <option value='canceled' >Canceled</option>
                        <option value='delivered' >Delivered</option>
                        <option value='waitToConfirm' >Wait to confirm</option>
                        <option value='confirmed' >Confirm</option>
                    </select>
                    <label>Has paid</label>
                    <select defaultValue={1} name="hasPaid" onChange={onDetailSearchInputChange}>
                        <option value={1} >Yes</option>
                        <option value={0} >No</option>
                    </select>
                    <label>Sort by</label>
                    <select defaultValue={'createdAt'} name="sortField" onChange={onDetailSearchInputChange}>
                        <option value='totalCost' >total cost</option>
                        <option value='amount' >amount</option>
                        <option value='createdAt' >time created</option>
                    </select>
                    <div>
                        <input type="radio" name="sortOrder" value="asc" onChange={onDetailSearchInputChange} /><label>Ascending </label>
                        <input type="radio" name="sortOrder" value="desc" defaultChecked onChange={onDetailSearchInputChange}/><label>Descending </label>
                    </div>
                    <button type='submit' style={{ display: 'flex' }}>Submit</button>
                </form>
            </section>
            <section className='admin_main_content'>
                <div>
                    <form style={{ display: 'flex', justifyContent: 'center' }}>
                        <input type="search" placeholder="order id" name="generalSearchInput" />
                        <button type='submit' style={{ display: 'flex' }}><BsSearch /></button>
                    </form>
                </div>

                <div className='centerChildren'>
                    {res &&
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}>Id</th><th>User</th><th>Product</th><th>Amount</th><th>Total Cost</th><th>Status</th><th>Has Paid?</th><th>Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {res.map((order) => (<tr key={order.id}><td>{order.id}</td><td><a href={"/admin/users/user/" + order.user.id}>{order.user.name}</a></td><td><a href={'/admin/products/product/' + order.product.id}>{order.product.name}</a></td>
                                    <td>{order.amount}</td><td>{(order.deliveryFee + order.totalPrice).toLocaleString('de-DE')}</td><td>{order.status}</td><td>{order.hasPaid}</td>
                                    <td className="centerChildren"><button className="centerChildren" onClick={() => { navigate('/admin/orders/order/' + order.id) }}><AiOutlineEdit /></button></td></tr>))}
                            </tbody>
                        </table>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>

            </section>
        </article>)
}