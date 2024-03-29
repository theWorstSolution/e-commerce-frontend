import axiosInstance from '../utils/axiosInstance'
import axios from 'axios';

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

function getUsers(){
    // console.log('getUsers')
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/users'
    })
    // const response = axios.get('http://localhost:3000/v1/user/users')
    // console.log('getUsers123')
    // console.log(response)
    return response;
}

export {getUser, getUsers};