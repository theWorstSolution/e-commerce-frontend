import axiosInstance from '../utils/axiosInstance'
import axios from 'axios';

function createUser(){
    const response = axiosInstance({
        method: 'POST',
        url: '/v1/users/user'
    })
    return response;
}

function getUser(userId){
    // console.log('getUser')
    console.log('in get user service');
    console.log(userId);
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/users/user/'+userId
    })
    // console.log('getUser123')
    return response;
}

function getUsers(filter, options){
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/users',
        params: {filter, options},
    })
    
    return response;
}

function updateUser(uid, updateBody){
    const response = axiosInstance({
        method: 'PATCH',
        url: '/v1/users/user/' + uid,
        data: updateBody
    })
    return response
}

function genRecommendedProducts(){
    const response = axiosInstance({
        method: 'POST',
        url: '/v1/users/user/recommended-products',
    })
    return response
}

function getRecommendedProducts(options){
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/users/user/recommended-products',
        params: options
    })
    return response
}

function fetchNotis(){
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/users/user/notifications',
    })
    return response
}
function setHasSeenAllNotis(){
    const response = axiosInstance({
        method: 'POST',
        url: '/v1/users/user/has-read-all-notifications',
    })
    return response
}

export {getUser, getUsers, updateUser};
export default {getUser, getUsers, updateUser, genRecommendedProducts, getRecommendedProducts, 
    createUser, fetchNotis, setHasSeenAllNotis};