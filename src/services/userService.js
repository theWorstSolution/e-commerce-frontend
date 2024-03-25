import axiosInstance from '../utils/axiosInstance'
import axios from 'axios';

function getUser(){
    // console.log('getUser')
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/user/user'
    })
    // console.log('getUser123')
    return response;
}

function getUsers(){
    // console.log('getUsers')
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/user/users'
    })
    // const response = axios.get('http://localhost:3000/v1/user/users')
    // console.log('getUsers123')
    // console.log(response)
    return response;
}

export {getUser, getUsers};