import { Link, useOutletContext } from "react-router-dom";
import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import { updateUser } from "../services/userService";
import orderService from "../services/orderService";
import { Pagination } from '@mui/material';
import { useNavigate,useSearchParams } from 'react-router-dom';

export default function BuyHistory(){
    const { setCurrentTab } = useOutletContext();
    setCurrentTab('Buy history')

    const [searchParams, setSearchParams] = useSearchParams();   
    const { user } = useContext(globalContext);
    const [res, setRes] = useState()
    const [pagiProps, setPagiProps] = useState({
        boundaryCount: 1, //Number of always visible pages at the beginning and end.
        count: 1, // total page
        hideNextButton: false,
        hidePrevButton: false,
        page: 1, //current page
    });
    const onChangePage = useCallback(async (event, page) => {
        setSearchParams((params) => {
            params.set("page", page)
            return params
        } );
    }, [])

    useEffect(()=>{
        const filter = {user: user.id};
        const initialPage = searchParams.get('page')
        const options = {populate: 'product', page: initialPage}
        
        orderService.getOrders(filter, options).then(({data})=>{
                console.log(data);
                setRes(data.results)
                setPagiProps((pagiProps) => ({
                    ...pagiProps,
                    count: data.totalPages,
                    page: data.page
                }))
        })
    },[searchParams])
    
    return (<div>{res &&  <div><ul >
        {res.map((order)=><li key={order.id} style={{display:'flex', flexDirection:'row'}}>
            <img src={order.product.pictures[0]} style={{width:'var(--productThumbnailWidth)', height:'var(--productThumbnailHeight)'}}></img>
            <div>
                <h3><Link to={'/products/product/'+order.product.id}>{order.product.name}</Link></h3>
                <p><label>Bought amount:</label>{order.amount}</p>
                <p><label>Total cost:</label>{order.totalCost}</p>
            </div>
        </li>)}
    </ul><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>}</div>)
    
}

