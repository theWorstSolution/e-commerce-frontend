import { Link, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import productService from "../services/productService";
import Creatable from 'react-select/creatable';
import HomeHeader from "../components/HomeHeader";
import { BsCaretRightFill, BsArrowRightCircle, BsArrowLeftCircle,BsStar } from "react-icons/bs";
import orderService from "../services/orderService";
import { globalContext } from '../contexts/globalContext';

export default function ProductDetail() {
    const { user } = useContext(globalContext);
    const { productId } = useParams()
    const [product, setProduct] = useState()
    const [amount, setAmount] = useState(1)
    useEffect(() => {
        productService.getProduct(productId).then(async ({ data: product }) => {
            console.log('product: ' + JSON.stringify(product));
            setProduct(product)
        })
    }, [])
    function onBuy(){
        const isConfirmed = window.confirm('Buy '+ amount + ' x ' + product.name + '? That will be ' + amount*product.price + '$')
        if(isConfirmed){
            orderService.createOrder({user: user.id, product: productId, amount}).then(({data})=>{
                console.log(data)
                if(data){
                    alert('Buy successfully')
                }
            })
        }
    }
    return (<div>
        <HomeHeader navigateLinkOnSearch='/'></HomeHeader>
        {product && <article>
            <div>{product.categories.map((cat, idx) => {
                if (idx == product.categories.length - 1) {
                    return <Link to={'/products?categoryId='+cat.id}>{cat.name}</Link>
                }
                return <Link to={'/products?categoryId='+cat.id}>{cat.name + ' > '}</Link>
            })}</div>
            <div style={{display:'flex'}}>
                <img src={product.picture[0]}></img>
                <div>
                    <h3>{product.name}</h3>
                    <p><label>Price:</label> {product.price+'$'}</p>
                    <p><label>Rating:</label> {product.rating}<BsStar /></p>
                    <p><label>Sold amount:</label> {product.soldAmount}</p>
                    <form><label>Amount</label><input onChange={(e)=>{setAmount(e.target.value)}} type="number" defaultValue={amount} min={1}/></form>
                    <button type="submit">Put in cart</button><button type="submit" onClick={onBuy}>Buy</button>
                </div>
            </div>
            <div>
                <h3>Description:</h3>
                <p>{product.description}</p>
            </div>
            <section>
                <h2>Review</h2>
            </section>
        </article>}
    </div>)
}