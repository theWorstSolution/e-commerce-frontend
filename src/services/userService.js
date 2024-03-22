import axiosInstance from '../utils/axiosInstance'

function getUser(){
    console.log('getUser')
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/user'
    })
    console.log('getUser123')
    return response;
}

export {getUser};