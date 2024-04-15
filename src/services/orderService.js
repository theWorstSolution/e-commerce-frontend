import axiosInstance from '../utils/axiosInstance'
import axios from 'axios';

function getOrder(id){
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/orders/order/'+id
    })
    // console.log('getUser123')
    return response;
}


function getOrders(filter, options){
    // console.log('getUsers')
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/orders',
        params: {filter, options}
    })
    // TODO: thêm query
    return response;
}

function updateOrder(id, updateBody){
    const response = axiosInstance({
        method: 'PATCH',
        url: '/v1/orders/order/' + id,
        data: updateBody
    })
    return response
}
function createOrder(body){
    const response = axiosInstance({
        method: 'POST',
        url: '/v1/orders/order/',
        data: body
    })
    return response
}

function getOrderByUser(id){
    return getOrders({user:id})
}

function getOrderByProduct(id){
    return getOrders({product:id})
}

export default {getOrder, getOrders, updateOrder, createOrder,getOrderByProduct, getOrderByUser};