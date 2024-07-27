import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext, useMemo } from "react";
import productService from "../services/productService";
import Creatable from 'react-select/creatable';
import HomeHeader from "../components/HomeHeader";
import { BsCaretRightFill, BsArrowRightCircle, BsArrowLeftCircle, BsStar, BsFillStarFill, BsPlusLg, BsDashLg, BsCartPlus } from "react-icons/bs";
import orderService from "../services/orderService";
import reviewService from "../services/reviewService";
import { globalContext } from '../contexts/globalContext';
import userService from "../services/userService";
import User from "../models/User";
import { Pagination } from '@mui/material';
import { Avatar, Breadcrumb, Button, Card, Divider, InputNumber, List, Modal, Popconfirm, Rate, message } from "antd";
import { SampleNextArrow, SamplePrevArrow } from '../components/SlickerArrow'
import Slider from "react-slick";
import TextArea from "antd/es/input/TextArea";
import Meta from "antd/es/card/Meta"
import Footer from "../components/Footer";
import utils from "../utils/utils";

export default function ProductDetail() {
    const navigate = useNavigate();
    const { user, setUser, alertApi, screenSize } = useContext(globalContext);
    const { productId } = useParams()
    const [product, setProduct] = useState()
    const [amount, setAmount] = useState(1)
    const [hasBought, setHasBought] = useState()
    const [hasReviewed, setHasReviewed] = useState()

    // user review input
    const [rating, setRating] = useState(3)
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
        const options = { sortBy: 'createdAt', populate: 'user.name,user.picture', page }
        const { data } = await reviewService.getReviews(filter, options)
        console.log('aaaaa');
        console.log(data);
        setReviews(data.results)
        setPagiProps((pagiProps) => ({
            ...pagiProps,
            count: data.totalPages,
            page: data.page
        }))
        if (hasBought && hasReviewed) {
            for (let review of data.results) {
                if (review.user.id.toString() == user.uid.toString()) {
                    setRating(review.rating)
                    setReviewContent(review.content)
                    break;
                }
            }

        }
    }


    // set product, hasBought, hasReviewed, reviews, pagiProps
    useEffect(() => {

        productService.getProduct(productId).then(async ({ data: product }) => {
            console.log('product: ');
            console.log(product);
            setProduct(product)
            setMainPic(product.pictures[0])
            window.scrollTo(0, 0)
            // set hasBought
            if (user) {
                setHasBought(false)
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
            const options = { sortBy: 'createdAt', populate: 'user.name,user.picture', page: 1 }
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
    }, [productId])

    // case hasBought and hasReviewed, change rating and reviewContent to reviewed data so that we can update them
    useEffect(() => {
        if (hasBought && hasReviewed && reviews?.length > 0) {
            for (let review of reviews) {
                if (review.user.id.toString() == user.uid.toString()) {
                    setRating(review.rating)
                    setReviewContent(review.content)
                    break;
                }
            }

        }
    }, [hasBought, hasReviewed, reviews])

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
    // function onBuy() {
    //     const isConfirmed = window.confirm('Buy ' + amount + ' x ' + product.name + '? That will be ' + amount * product.price + '$')

    //     if (isConfirmed) {
    //         orderService.createOrder({ user: user.id, product: productId, amount }).then(async ({ data }) => {
    //             console.log(data)
    //             if (data) {
    //                 // alert('Buy successfully')
    //                 alertApi.open({
    //                     type: 'success',
    //                     content: 'successful!',
    //                 });
    //             }
    //             // await user.refresh()
    //             const newUser = new User()
    //             Object.assign(newUser, user)
    //             newUser.foo = 'foo'
    //             await newUser.refresh()
    //             setUser(newUser)
    //             setHasBought(true)
    //         })
    //     }
    // }
    function putInCart() {
        if (!user) { navigate('/auth'); return }
        setDisabledAddToCart(true)
        if (user.cart.filter((product) => product.id == productId).length != 0) {
            // alert('Already existed in cart')
            alertApi.destroy()
            alertApi.open({
                type: 'warning',
                content: 'Already existed in cart',
            });
            setDisabledAddToCart(false)
        } else {
            alertApi.destroy()
            alertApi.open({
                type: 'loading',
                content: 'Action in progress..',
                duration: 0,
            });
            userService.updateUser(user.uid, { cart: [...user.cart.map((product) => product.id), productId] }).then(({ data }) => {
                setDisabledAddToCart(false)
                console.log(data);
                const newUser = new User()
                Object.assign(newUser, user)
                newUser.cart.push(product)
                setUser(newUser)
                // alert('Put in cart successfully')
                alertApi.destroy()
                alertApi.open({
                    type: 'success',
                    content: 'successful!',
                });
            })
        }
    }

    function createBreadcrumbList(product) {
        let res = product.categories.map((cat, idx) =>
            ({ title: cat.name, href: '/products?categoryId=' + cat.id }))
        res.push({ title: product.name })
        return res
    }

    const slickerSettings = useMemo(() => ({
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: utils.getResponsiveValue(screenSize,3,5),
        slidesToScroll: 1,
        nextArrow: utils.getResponsiveValue(screenSize,product?.pictures.length > 3 ? <SamplePrevArrow /> : null, product?.pictures.length > 5 ? <SamplePrevArrow /> : null),
        prevArrow: utils.getResponsiveValue(screenSize,product?.pictures.length > 3 ? <SampleNextArrow /> : null, product?.pictures.length > 5 ? <SampleNextArrow /> : null),
    }), [product]);

    const [mainPic, setMainPic] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disabledAddToCart, setDisabledAddToCart] = useState(false);

    return (<div>
        <HomeHeader navigateLinkOnSearch='/'></HomeHeader>
        {product && <div><article>
            <Breadcrumb
                style={{ paddingLeft: 'var(--y-margin)', paddingTop: 'var(--section-dist)' }}
                separator=">"
                items={createBreadcrumbList(product)}
            />
            <section className="sectionCard" style={{ display: 'flex', gap: '20px', minWidth:'0' }}>
                {/* BUG: bỏ width100px đi thì nếu nhiều hơn 5 ảnh là lỗi => minWidth:'0' fix dc*/}
                {screenSize.isPc && <div style={{ flex: 2, minWidth:'0' }}>
                    <img src={mainPic} style={{ width: '100%' }}></img>
                    <Slider {...slickerSettings}>
                        {product.pictures.map((pic) =>
                            <div key={pic} onClick={() => { setMainPic(pic) }}><img src={pic} style={{ width: '100px', objectFit: 'cover' }} /></div>)}
                    </Slider>
                </div>}
                <div style={{ flex: 3, minWidth:'0' }}>
                    <h3>{product.name}</h3>
                    {screenSize.isMobile && <div>
                        <div><img src={mainPic} style={{width:'100%', objectFit:'cover'}}></img></div>
                        <div>
                            <Slider {...slickerSettings} >
                                {product.pictures.map((pic) =>
                                    <div  key={pic} onClick={() => { setMainPic(pic) }}><img src={pic} style={{ width: '100%', objectFit: 'contain' }} /></div>)}
                            </Slider>
                        </div>
                    </div>}
                    <p><label>Price:</label> {product.price.toLocaleString('de-DE') + 'đ'}</p>
                    <p><label>Rating:</label> {product.rating}<BsStar /></p>

                    <p><label>Sold amount:</label> {product.soldAmount}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '20px', paddingBottom: '16px' }}>
                        <label>Amount:</label><InputNumber className="amountInput"
                            controls={false}
                            // addonBefore={<div style={{cursor:'pointer'}} onClick={()=>{setAmountValue((amountValue)=>--amountValue)}}>-</div>} 
                            addonBefore={<div className="centerChildren" style={{ cursor: amount == 1 ? 'not-allowed' : 'pointer', padding: '11px' }} onClick={amount == 1 ? null : () => { setAmount((amountValue) => --amountValue) }}><BsDashLg /></div>}
                            addonAfter={<div className="centerChildren" style={{ cursor: 'pointer', padding: '11px' }} onClick={() => { setAmount((amountValue) => ++amountValue) }}><BsPlusLg /></div>}
                            value={amount} min={1}
                            onChange={(value) => setAmount(value)}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '20px' }}>
                        <Button size="large" icon={<BsCartPlus />} iconPosition='start' onClick={putInCart} disabled={disabledAddToCart}>Put in cart</Button>
                        <Button size="large" type='primary' onClick={() => { setIsModalOpen(true) }}>Buy now</Button>
                        <Modal title="Confirm" open={isModalOpen}
                            okText='Pay with Zalopay'
                            onOk={() => {
                                message.loading('Action in progress..');
                                setIsModalOpen(false)
                                orderService.createOrder({ user: user.id, product: productId, amount }).then(async (res) => {
                                    // console.log(res)
                                    const payUrl = res.data
                                    window.location.href = payUrl;
                                    // if (data) {
                                    //     // alert('Buy successfully')
                                    //     alertApi.open({
                                    //         type: 'success',
                                    //         content: 'successful!',
                                    //     });
                                    // }
                                    // await user.refresh()

                                    // const newUser = new User()
                                    // Object.assign(newUser, user)
                                    // newUser.foo = 'foo'
                                    // await newUser.refresh()
                                    // setUser(newUser)
                                    // setHasBought(true)
                                })
                            }} onCancel={() => { setIsModalOpen(false) }}>
                            {'Buy ' + amount + ' x ' + product.name + '? That will be ' + (amount * product.price).toLocaleString('de-DE') + 'đ'}
                        </Modal>
                    </div>
                    <div>
                        <h3>Description:</h3>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>
                    </div>

                </div>
            </section>

            <div style={{ display: 'flex' }}>
                <section className="sectionCard reviews">
                    <h2>Review</h2>
                    {hasBought && !hasReviewed && <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '20px', height: '84px', padding: '20px 0' }}>
                            <div style={{ height: '100%' }}><img src={user.picture} style={{ objectFit: 'cover' }}></img></div>
                            <div style={{ height: '100%' }}>
                                <h3 style={{ marginTop: '0', marginBottom: '10px' }}>{user.name}</h3>
                                <Rate value={rating} allowClear={false} onChange={(value) => setRating(value)} />
                            </div>
                            <div />
                        </div>

                        <div>
                            <TextArea placeholder='How do you feel about this product?' rows={4} value={reviewContent}
                                onChange={(e) => {
                                    setReviewContent(e.target.value)
                                }}
                            />
                            <div style={{ textAlign: 'right' }}>
                                <Button style={{ marginTop: '8px', marginLeft: 'auto' }} type='primary' onClick={async () => {
                                    const { data } = await reviewService.createReview(product.id, rating, reviewContent)
                                    // alert('posted review')
                                    alertApi.open({
                                        type: 'success',
                                        content: 'successful!',
                                    });
                                    console.log(data);
                                    setHasReviewed(true)
                                    onChangePage(null, 1)
                                }}>Submit</Button>
                            </div>



                        </div>
                        <Divider />
                    </div>
                    }

                    <List
                        itemLayout="vertical"
                        dataSource={reviews}
                        renderItem={(review, index) =>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={review.user.picture} />}
                                    title={review.user.name}
                                />
                                {user && (review.user.id.toString() == user.uid.toString()) ?
                                    <div>
                                        <Rate value={rating} allowClear={false} onChange={(value) => setRating(value)} />
                                        <TextArea rows={4} value={reviewContent}
                                            onChange={(e) => {
                                                setReviewContent(e.target.value)
                                            }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', paddingTop: '10px' }}>
                                            {/* <Button danger onClick={() => {
                                                reviewService.deleteReview(review.id).then(({ data }) => {
                                                    console.log(data);
                                                    setHasReviewed(false);
                                                    setRating(0)
                                                    setReviewContent('')
                                                    onChangePage(null, pagiProps.page)
                                                })
                                            }}>Delete</Button> */}
                                            <Popconfirm
                                                title="Delete review"
                                                description="Are you sure to delete this review?"
                                                onConfirm={() => {
                                                    reviewService.deleteReview(review.id).then(({ data }) => {
                                                        console.log(data);
                                                        setHasReviewed(false);
                                                        setRating(0)
                                                        setReviewContent('')
                                                        onChangePage(null, pagiProps.page)
                                                        message.success('successful!');
                                                    })
                                                }}
                                                // onCancel={cancel}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button danger>Delete</Button>
                                            </Popconfirm>
                                            <Button type="primary" onClick={async () => {
                                                const { data } = await reviewService.updateReview(review.id, rating, reviewContent)
                                                // alert('posted review')
                                                alertApi.open({
                                                    type: 'success',
                                                    content: 'successful!',
                                                });
                                                console.log(data);
                                            }}>Update</Button>
                                        </div>
                                    </div> : <div>
                                        <Rate value={review.rating} disabled />
                                        <p>{review.content}</p>
                                    </div>}

                            </List.Item>
                        }
                    />


                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>
                </section>

                {screenSize.isPc && <section style={{ padding: '8px 32px', flex: 0.2, marginLeft: 0 }} className="sectionCard">
                    <h2 style={{ textAlign: 'center' }}>Similar products</h2>
                    <ul className='productGrid' style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
                        {product?.similarProducts.map((product) => <li key={product.id}>
                            <Card
                                onClick={() => { navigate('/products/product/' + product.id) }}
                                hoverable
                                style={{}}
                                cover={<img className="" src={product.pictures[0]}
                                    style={{ objectFit: 'cover', textAlign: 'center', height: '175px' }} />}
                            >
                                <Meta className="" title={<p className="multilineEllipsis">{product.name}</p>}
                                    description={<div><div>{product.rating} <BsStar /></div>
                                        <div>{product.price.toLocaleString('de-DE')}đ</div>
                                        <div>{product.soldAmount} sold</div></div>}
                                />
                            </Card>
                        </li>)}
                    </ul>
                </section>}
            </div>
            {screenSize.isMobile && <section className="sectionCard">
                <h2 style={{ textAlign: 'center' }}>Similar products</h2>
                <ul className='productGrid' style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
                    {product?.similarProducts.map((product) => <li key={product.id}>
                        <Card
                            onClick={() => { navigate('/products/product/' + product.id) }}
                            hoverable
                            style={{}}
                            cover={<img className="" src={product.pictures[0]}
                                style={{ objectFit: 'cover', textAlign: 'center', height: '175px' }} />}
                        >
                            <Meta className="" title={<p className="multilineEllipsis">{product.name}</p>}
                                description={<div><div>{product.rating} <BsStar /></div>
                                    <div>{product.price.toLocaleString('de-DE')}đ</div>
                                    <div>{product.soldAmount} sold</div></div>}
                            />
                        </Card>
                    </li>)}
                </ul>
            </section>}
        </article><Footer /></div>}

    </div>)
}