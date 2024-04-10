import axiosInstance from '../utils/axiosInstance'
import axios from 'axios';
// const rootCategoryId = '660b2b2353065020b4909007';
const rootCategoryId = process.env.REACT_APP_ROOT_CATEGORY_ID
if(!rootCategoryId){
    throw 'not set env.REACT_APP_ROOT_CATEGORY_ID'
}
function getChildrenCategory(id){
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/categories/category/'+id+'/children'
    })
    // console.log('getUser123')
    return response;
}

// function updateProduct(id, updateBody){
//     const response = axiosInstance({
//         method: 'PATCH',
//         url: '/v1/products/product/' + id,
//         data: updateBody
//     })
//     return response
// }

function createCategory(body){
    const response = axiosInstance({
        method: 'POST',
        url: '/v1/categories/category/',
        data: body
    })
    return response
}

export {getChildrenCategory, createCategory};
export default {getChildrenCategory, createCategory, rootCategoryId};