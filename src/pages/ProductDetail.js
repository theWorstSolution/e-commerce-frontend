import { Link, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import productService from "../services/productService";
import Creatable from 'react-select/creatable';
import HomeHeader from "../components/HomeHeader";

export default function ProductDetail() {
    const { productId } = useParams()
    const [product, setProduct] = useState()
    useEffect(() => {
        productService.getProduct(productId).then(async ({ data: product }) => {
            console.log('product: ' + JSON.stringify(product));
            setProduct(product)
        })
    }, [])
    return (<div>
        <HomeHeader navigateLinkOnSearch='/'></HomeHeader>
        {product && <div>{product.categories.map((cat, idx) => {
            if (idx == product.categories.length - 1) {
                return <Link to={'/products?categoryId='+cat.id}>{cat.name}</Link>
            }
            return <Link to={'/products?categoryId='+cat.id}>{cat.name + ' > '}</Link>
        })}</div>}
    </div>)
}