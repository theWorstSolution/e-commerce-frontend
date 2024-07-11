import { Link, useOutletContext } from "react-router-dom";
import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import { updateUser } from "../services/userService";
import orderService from "../services/orderService";
import { Pagination } from '@mui/material';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { Avatar, List, DatePicker, Input } from "antd";

import utils from "../utils/utils";
const { RangePicker } = DatePicker;
const { Search } = Input;

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

    const [keyword, setKeyword] = useState('')
    const [dateRange, setDateRange] = useState()
    useEffect(()=>{
        // console.log(searchParams.get('dateRange'));
        // const filter = {user: user.id};
        // const initialPage = searchParams.get('page')
        // const options = {populate: 'product', page: initialPage, sortBy:'createdAt'}
        
        orderService.getOwnOrders(searchParams.get('keyword'), searchParams.get('page'),
            searchParams.get('startDate'), searchParams.get('endDate')
    ).then(({data})=>{
                console.log(data);
                setRes(data.results)
                setPagiProps((pagiProps) => ({
                    ...pagiProps,
                    count: data.totalPages,
                    page: data.page
                }))
        })
    },[searchParams])
    
    return (<div>
    <form style={{textAlign:'center'}}>
    <Search
        style={{width:'20%'}}
      placeholder="name or category"
      onChange={(e)=>{setKeyword(e.target.value)}}
      onSearch={()=>{
        if(dateRange){
            setSearchParams((params) => {
            params.set("startDate", dateRange[0])
            params.set("endDate", dateRange[1])
            params.set("keyword", keyword)
            params.set("page", 1)
            return params
        } );
        }else{
            setSearchParams((params) => {
            params.set("keyword", keyword)
            params.set("page", 1)
            return params
        } );
        }
      }}
    />
        <RangePicker style={{marginLeft:'20px'}} onChange={(dates,dateStrings)=>{
            console.log(dateStrings);
            setDateRange(dateStrings)
        }}/>
    </form>
    <article className="sectionCard" >
    <List
                    itemLayout="vertical"
                    dataSource={res}
                    renderItem={(order, index) => 
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Link to={'/products/product/'+order.product._id}><img src={order.product.pictures[0]} style={{width:'var(--productThumbnailWidth)', height:'var(--productThumbnailHeight)'}}></img></Link>}
                                title={<Link to={'/products/product/'+order.product._id}>{order.product.name}</Link>}
                                description={<div>
                                    {order.createdAt && <div><label>Bought at:</label> {utils.convertDate(order.createdAt)}</div>}
                                    <div><label>Order Id:</label> {order._id}</div>
                                    <div><label>Bought amount:</label> {order.amount}</div>
                                    <div><label>Total cost:</label> {order.totalCost.toLocaleString('de-DE')+'đ'}</div>
                                    <div><label>Status:</label> {order.status}</div>
                                    <div><label>Has been paid:</label> {order.hasPaid?'Yes':'No'}</div>
                                    </div>}

                            />

                        </List.Item>
                    }
                />
                <Pagination {...pagiProps} onChange={onChangePage} style={{ display:'flex', justifyContent:'flex-end'}} />
    </article></div>)
    
}

