import axiosInstance from '../utils/axiosInstance'
import axios from 'axios';

function getProduct(id){
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/products/product/'+id
    })
    // console.log('getUser123')
    return response;
}

/**
 * @param {object} query: {name,...}
 */
function getProducts(filter, options){
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/products',
        params: {filter, options},
    })
    
    return response;
}

function updateProduct(id, updateBody){
    const response = axiosInstance({
        method: 'PATCH',
        url: '/v1/products/product/' + id,
        data: updateBody
    })
    return response
}
function createProduct(body){
    const response = axiosInstance({
        method: 'POST',
        url: '/v1/products/product/',
        data: body
    })
    return response
}

export {getProduct, getProducts, updateProduct, createProduct};
export default {getProduct, getProducts, updateProduct, createProduct};