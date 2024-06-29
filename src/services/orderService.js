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

/**
 * 
 * @param {String} keyword 
 * @param {*} dateRange ['2024-06-25', '2024-06-28']
 * @returns 
 */
function getOwnOrders(keyword, page, startDate, endDate, gmt){
    console.log(keyword)
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/orders/own',
        params: {keyword,page, startDate, endDate, gmt:gmt?gmt:7}
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

/**
 * @param{String} body.userId
 * @param{Array<Object>} body.buyList
 * @param{String} body.buyList[].productId
 * @param{Number} body.buyList[].amount
 */
function createOrders(body){
    const response = axiosInstance({
        method: 'POST',
        url: '/v1/orders',
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

export default {getOwnOrders,getOrder, getOrders, updateOrder, createOrder,createOrders, getOrderByProduct, getOrderByUser};