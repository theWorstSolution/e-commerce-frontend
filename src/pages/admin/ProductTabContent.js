import { useCallback, useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import productService from "../../services/productService";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useNavigate,useSearchParams } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";
import { Category } from "@mui/icons-material";
const qs = require('qs')

export default function ProductTabContent() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    // const { setCurrentTab } = useOutletContext();
    const [res, setRes] = useState()
    const [pagiProps, setPagiProps] = useState({
        boundaryCount: 1, //Number of always visible pages at the beginning and end.
        count: 1, // total page
        hideNextButton: false,
        hidePrevButton: false,
        page: 1, //current page
    });
    const [generalSearchInput, setGeneralSearchInput] = useState()
    const onGeneralSearchInputChange = useCallback((event) => {
        setGeneralSearchInput(event.target.value)
    }, [])

    useEffect(() => {
        // setCurrentTab('Products')
        const initialGeneralSearchInput = searchParams.get('generalSearchInput')
        const initialPage = searchParams.get('page')
        if(initialGeneralSearchInput || initialGeneralSearchInput=='' || searchParams.size==0){
            const filter = {
                $or: [
                    { name: { $regex: initialGeneralSearchInput, $options: 'i' } },
                    { 'categories.name': { $regex: initialGeneralSearchInput, $options: 'i' } },
                    { description: { $regex: initialGeneralSearchInput, $options: 'i' } },
                ]
            }
            const options = {page: initialPage}
            productService.getProducts(filter, options).then(({data})=>{
                console.log(data);
                setRes(data.results)
                setPagiProps((pagiProps) => ({
                    ...pagiProps,
                    count: data.totalPages,
                    page: data.page
                }))
            })
        }else{
            const filter = {
                price:{}, soldAmount:{}
            }
            if(searchParams.get('id')){
                filter._id = searchParams.get('id')
            }
            if(searchParams.get('minPrice')!='' && searchParams.get('minPrice')){
                filter.price.$gte = searchParams.get('minPrice')
            }
            if(searchParams.get('maxPrice')!='' && searchParams.get('maxPrice')){
                filter.price.$lte = searchParams.get('maxPrice')
            }
            if(searchParams.get('minSoldAmount')!='' && searchParams.get('minSoldAmount')){
                filter.soldAmount.$gte = searchParams.get('minSoldAmount')
            }
            if(searchParams.get('maxSoldAmount')!='' && searchParams.get('maxSoldAmount')){
                filter.soldAmount.$lte = searchParams.get('maxSoldAmount')
            }
            console.log(filter);
            const options = {sortBy: searchParams.get('sortField')+':'+searchParams.get('sortOrder'), page:initialPage}
            productService.getProducts(filter, options).then(({data})=>{
                console.log(data);
                setRes(data.results)
                setPagiProps((pagiProps) => ({
                    ...pagiProps,
                    count: data.totalPages,
                    page: data.page
                }))
            })
        }

    
    }, [searchParams])
    const onAdd = useCallback(() => { navigate('/admin/products/product') }, []);
    const onGeneralSearchSubmit = useCallback(async (e) => {
        e.preventDefault()
        const queryString = qs.stringify({generalSearchInput}, { encode:false})
        navigate('/admin/products?'+queryString)
    }, [generalSearchInput])
    const onChangePage = useCallback(async (event, page) => {
        setSearchParams((params) => {
            params.set("page", page)
            return params
        } );
    }, [])
    const [detailSearchInput, setDetailSearchInput] = useState({sortField:'name', sortOrder:'asc'})
    const onDetailSearchInputChange = useCallback((event) => {
        const name = event.target.name;
        const value = event.target.value;
        setDetailSearchInput(values => ({ ...values, [name]: value }))
    }, [])
    const onDetailSearchSubmit = useCallback((e) => { 
        e.preventDefault()
        const queryString = qs.stringify(detailSearchInput, { encode:false})
        navigate('/admin/products?'+queryString)
    }, [detailSearchInput])



    return (
        <article className='admin_main'>
            <section>
                <h3 style={{ textAlign: 'center' }}>DETAIL SEARCH</h3>
                <form onSubmit={onDetailSearchSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>Id</label>
                    <input type='search' name="id" onChange={onDetailSearchInputChange} />
                    <label>Price</label>
                    <input type='number' name="minPrice" onChange={onDetailSearchInputChange} />
                    <input type='number' name="maxPrice" onChange={onDetailSearchInputChange} />
                    <label>Sold amount</label>
                    <input type='number' name="minSoldAmount" onChange={onDetailSearchInputChange} />
                    <input type='number' name="maxSoldAmount" onChange={onDetailSearchInputChange} />
                    <label>Sort by</label>
                    <select value={detailSearchInput.sortField} name="sortField" onChange={onDetailSearchInputChange}>
                        <option value='name' >Name</option>
                        <option value='price' >Price</option>
                        <option value='soldAmount' >Sold amount</option>
                    </select>
                    <div>
                        <input type="radio" onChange={onDetailSearchInputChange} name="sortOrder" value="asc" defaultChecked={detailSearchInput.sortOrder=='asc'}/><label>Ascending </label>
                        <br/><input type="radio" onChange={onDetailSearchInputChange} name="sortOrder" value="desc" defaultChecked={detailSearchInput.sortOrder=='desc'}/><label>Descending </label>
                    </div>
                    <button type='submit' style={{ display: 'flex' }}>Submit</button>
                </form>
            </section>
            <section className='admin_main_content'>
                <div>
                    <form onSubmit={onGeneralSearchSubmit} style={{ display: 'flex', justifyContent: 'center' }}>
                        <input type='search' name="generalSearchInput" onChange={onGeneralSearchInputChange} />
                        <button type='submit' style={{ display: 'flex' }}><BsSearch /></button>
                    </form>
                    <button onClick={onAdd} style={{ marginLeft: 'auto', marginRight: 0, display: 'flex' }}><BsPlusLg /></button>
                </div>

                <div className='centerChildren'>
                    {res &&
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>Id</th><th style={{minWidth:'175px'}}>Name</th><th>Category</th><th>Description</th><th>Price</th><th>Sold amount</th><th>Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {res.map((product) => (<tr key={product.id} style={{maxHeight:'100px'}}><td style={{wordBreak:'break-word'}}>{product.id}</td><td className="multilineEllipsis" style={{WebkitLineClamp:4}}>{product.name}</td>
                                    <td>{product.categories.map((cat, idx) => {
                                        if (idx == product.categories.length - 1) {
                                            return cat.name
                                        }
                                        return cat.name + ' > '
                                    })}</td><td className="multilineEllipsis" style={{WebkitLineClamp:4}}>{product.description}</td><td>{product.price.toLocaleString('de-DE')}</td><td>{product.soldAmount}</td>
                                    <td className="centerChildren"><button className="centerChildren" onClick={() => { navigate('/admin/products/product/' + product.id) }}><AiOutlineEdit /></button></td></tr>))}
                            </tbody>
                        </table>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>

            </section>
        </article>)
}