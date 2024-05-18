import { Link, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import productService from "../services/productService";
import Creatable from 'react-select/creatable';
import HomeHeader from "../components/HomeHeader";
import { BsCaretRightFill, BsArrowRightCircle, BsArrowLeftCircle, BsStar, BsFillStarFill } from "react-icons/bs";
import orderService from "../services/orderService";
import reviewService from "../services/reviewService";
import { globalContext } from '../contexts/globalContext';
import userService from "../services/userService";
import User from "../models/User";
import { Pagination } from '@mui/material';

export default function ProductDetail() {
    const { user, setUser } = useContext(globalContext);
    const { productId } = useParams()
    const [product, setProduct] = useState()
    const [amount, setAmount] = useState(1)
    const [hasBought, setHasBought] = useState()
    const [hasReviewed, setHasReviewed] = useState()

    // user review input
    const [rating, setRating] = useState(0)
    const [reviewContent, setReviewContent] = useState('')

    const [reviews, setReviews] = useState()
    const [pagiProps, setPagiProps] = useState({
        boundaryCount: 1, //Number of always visible pages at the beginning and end.
        count: 1, // total page
        hideNextButton: false,
        hidePrevButton: false,
        page: 1, //current page
    });

    const onChangePage = async (event, page) => {
        const filter = { product: product.id }
        const options = { sortBy: 'timeCreated', populate: 'user.name,user.picture', page }
        const { data } = await reviewService.getReviews(filter, options)
        console.log('aaaaa');
        console.log(data);
        setReviews(data.results)
        setPagiProps((pagiProps) => ({
            ...pagiProps,
            count: data.totalPages,
            page: data.page
        }))
        if(hasBought && hasReviewed){
            for(let review of data.results){
                if (review.user.id.toString() == user.uid.toString()){
                    setRating(review.rating)
                    setReviewContent(review.content)
                    break;
                }
            }
            
        }
    }



    function renderRatingInput(rating) {
        const res = []
        for (let i = 1; i <= 5; i++) {
            if (i < rating) {
                res.push(<BsFillStarFill onClick={() => { setRating(i) }} />)
            } else if (i == rating) {
                res.push(<BsFillStarFill onClick={() => { setRating(0) }} />)
            } else {
                res.push(<BsStar onClick={() => { setRating(i) }} />)
            }
        }
        return res
    }

    function renderRating(rating) {
        const res = []
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                res.push(<BsFillStarFill />)
            } else {
                res.push(<BsStar />)
            }
        }
        return res
    }

    // set product, hasBought, hasReviewed, reviews, pagiProps
    useEffect(() => {

        productService.getProduct(productId).then(async ({ data: product }) => {
            // console.log('product: ' + JSON.stringify(product));
            setProduct(product)

            // set hasBought
            if (user) {
                for (let boughtProduct of user.boughtProducts) {
                    if (boughtProduct.toString() == product.id) {
                        setHasBought(true)
                        const filter = { user: user.uid, product: product.id }
                        const { data } = await reviewService.getReviews(filter)
                        if (data.results.length > 0) {
                            setHasReviewed(true)
                        } else { setHasReviewed(false) }
                        break
                    }
                }
            } else {
                setHasBought(false)
            }


            
            const filter = { product: product.id }
            const options = { sortBy: 'timeCreated', populate: 'user.name,user.picture', page: 1 }
            const { data } = await reviewService.getReviews(filter, options)
            setReviews(data.results)
            console.log('set reviews');
            console.log(data.results);
            setPagiProps((pagiProps) => ({
                ...pagiProps,
                count: data.totalPages,
                page: data.page
            }))
            
            
        })
    }, [])

    // case hasBought and hasReviewed, change rating and reviewContent to reviewed data so that we can update them
    useEffect(()=>{
        if(hasBought && hasReviewed && reviews?.length>0){
            for(let review of reviews){
                if (review.user.id.toString() == user.uid.toString()){
                    setRating(review.rating)
                    setReviewContent(review.content)
                    break;
                }
            }
            
        }
    },[hasBought, hasReviewed, reviews])

    // set hasBought
    // useEffect(async () => {
    //     if (product) {
    //         for (let boughtProduct of user.boughtProducts) {
    //             if (boughtProduct.toString() == product.id) {
    //                 setHasBought(true)
    //                 const filter = { user: user.uid, product: product.id }
    //                 const { data } = await reviewService.getReviews(filter)
    //                 if (data.results.length > 0) {
    //                     setHasReviewed(true)
    //                 } else { setHasReviewed(false) }
    //                 return
    //             }
    //         }
    //         setHasBought(false)
    //     }
    // }, [user])
    function onBuy() {
        const isConfirmed = window.confirm('Buy ' + amount + ' x ' + product.name + '? That will be ' + amount * product.price + '$')
        if (isConfirmed) {
            orderService.createOrder({ user: user.id, product: productId, amount }).then(async ({ data }) => {
                console.log(data)
                if (data) {
                    alert('Buy successfully')
                }
                // await user.refresh()
                const newUser = new User()
                Object.assign(newUser, user)
                newUser.foo = 'foo'
                await newUser.refresh()
                setUser(newUser)
                setHasBought(true)
            })
        }
    }
    function putInCart() {
        if (user.cart.filter((product) => product.id == productId).length != 0) {
            alert('Already existed in cart')
        } else {
            userService.updateUser(user.uid, { cart: [...user.cart.map((product) => product.id), productId] }).then(({ data }) => {
                console.log(data);
                const newUser = new User()
                Object.assign(newUser, user)
                newUser.cart.push(product)
                setUser(newUser)
                alert('Put in cart successfully')
            })
        }
    }
    return (<div>
        <HomeHeader navigateLinkOnSearch='/'></HomeHeader>
        {product && <article>
            <div>{product.categories.map((cat, idx) => {
                if (idx == product.categories.length - 1) {
                    return <Link to={'/products?categoryId=' + cat.id}>{cat.name}</Link>
                }
                return <Link to={'/products?categoryId=' + cat.id}>{cat.name + ' > '}</Link>
            })}</div>
            <div style={{ display: 'flex' }}>
                <img src={product.pictures[0]}></img>
                <div>
                    <h3>{product.name}</h3>
                    <p><label>Price:</label> {product.price + '$'}</p>
                    <p><label>Rating:</label> {product.rating}<BsStar /></p>
                    <p><label>Sold amount:</label> {product.soldAmount}</p>
                    <form><label>Amount</label><input onChange={(e) => { setAmount(e.target.value) }} type="number" defaultValue={amount} min={1} /></form>
                    <button type="submit" onClick={putInCart}>Put in cart</button><button type="submit" onClick={onBuy}>Buy</button>
                </div>
            </div>
            <div>
                <h3>Description:</h3>
                <p>{product.description}</p>
            </div>
            <section>
                <h2>Review</h2>
                {hasBought && !hasReviewed && <div><img src={user.picture}></img>{user.name}
                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        const { data } = await reviewService.createReview(product.id, rating, reviewContent)
                        alert('posted review')
                        console.log(data);
                        setHasReviewed(true)
                        onChangePage(null,1)
                    }}>
                        <div>{renderRatingInput(rating)}</div>
                        <input type="text" placeholder='How do you feel about this product?' value={reviewContent} onChange={(e) => {
                            setReviewContent(e.target.value)
                        }} />
                        <button type="submit">Submit</button>
                    </form>
                </div>}

                <ul style={{ listStyleType: 'none', padding: 0 }}>{reviews && reviews.map((review) => {
                    if (user && (review.user.id.toString() == user.uid.toString())) {
                        return (<li key={review.id}>
                            <img src={review.user.picture}></img>{review.user.name}
                            <form onSubmit={async (e) => {
                                e.preventDefault()
                                const { data } = await reviewService.updateReview(review.id, rating, reviewContent)
                                alert('posted review')
                                console.log(data);
                            }}>
                                <div>{renderRatingInput(rating)}</div>
                                <input type="text" value={reviewContent} onChange={(e) => {
                                    setReviewContent(e.target.value)
                                }} />
                                <button onClick={()=>{
                                    reviewService.deleteReview(review.id).then(({data})=>{
                                        console.log(data);
                                        setHasReviewed(false);
                                        setRating(0)
                                        setReviewContent('')
                                        onChangePage(null,pagiProps.page)
                                    })
                                }}>Delete</button>
                                <button type="submit">Update</button>
                            </form>
                        </li>)
                    } else {
                        return (
                            <li key={review.id}>
                                <img src={review.user.picture}></img>{review.user.name}
                                <div>{renderRating(review.rating)}</div>
                                <p>{review.content}</p>
                            </li>)
                    }
                })}</ul>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>
                <button onClick={()=>{console.log(rating);}}>clgt</button>
            </section>
        </article>}
    </div>)
}