import axiosInstance from "../utils/axiosInstance";


function createReview(productId, rating, content){
    const response = axiosInstance({
        method: 'POST',
        url: '/v1/reviews/review/',
        data:  {product:productId, rating, content}
    })
    return response
}

function  getReviews(filter,options){
    const response = axiosInstance({
        method: 'GET',
        url: '/v1/reviews',
        params: {filter, options},
    })
    
    return response;
}

function  updateReview(reviewId, rating, content){
    const response = axiosInstance({
        method: 'PATCH',
        url: '/v1/reviews/review/'+reviewId,
        data: {rating, content},
    })
    
    return response;
}

function  deleteReview(reviewId){
    const response = axiosInstance({
        method: 'DELETE',
        url: '/v1/reviews/review/'+reviewId,
    })
    
    return response;
}

export default {createReview, getReviews, updateReview, deleteReview};