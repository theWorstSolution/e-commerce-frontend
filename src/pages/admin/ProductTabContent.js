import { useCallback, useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import productService from "../../services/productService";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";
import { Category } from "@mui/icons-material";

export default function ProductTabContent() {
    const navigate = useNavigate()
    const { setCurrentTab } = useOutletContext();
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

    const lastRequest = useRef({ filter: null, options: null })
    useEffect(() => {
        setCurrentTab('Products')
        productService.getProducts().then((response) => {
            console.log(response)
            setRes(response.data.results)
            setPagiProps((pagiProps) => ({
                ...pagiProps,
                count: response.data.totalPages,
                page: response.data.page
            }))
        })
        lastRequest.current = { filter: null, options: null }
    }, [])
    const onAdd = useCallback(() => { navigate('/admin/products/product') }, []);
    const onGeneralSearchSubmit = useCallback(async (e) => {
        e.preventDefault()
        const filter = {
            $or: [
                { name: { $regex: generalSearchInput, $options: 'i' } },
                { 'categories.name': { $regex: generalSearchInput, $options: 'i' } },
                { description: { $regex: generalSearchInput, $options: 'i' } },
            ]
        }
        console.log('generalSearchInput: ' + generalSearchInput);
        const options = {}
        const { data } = await productService.getProducts(filter, options)
        console.log(data);
        setRes(data.results)
        setPagiProps((pagiProps) => ({
            ...pagiProps,
            count: data.totalPages,
            page: data.page
        }))
        lastRequest.current = { ...lastRequest.current, filter, options }
    }, [generalSearchInput])
    const onChangePage = useCallback(async (event, page) => {
        lastRequest.current.options = { ...lastRequest.current.options, page }
        const { data } = await productService.getProducts(lastRequest.current.filter, lastRequest.current.options)
        setRes(data.results)
        setPagiProps((pagiProps) => ({
            ...pagiProps,
            count: data.totalPages,
            page: data.page
        }))
    }, [])
    const [detailSearchInput, setDetailSearchInput] = useState()
    const onDetailSearchInputChange = useCallback((event) => {
        const name = event.target.name;
        const value = event.target.value;
        setDetailSearchInput(values => ({ ...values, [name]: value }))
    }, [])
    const onDetailSearchSubmit = useCallback(() => { }, [])
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
                    {/* sort field: thẻ select;
                    chiều sort: thẻ radio*/}
                    <label>Sort by</label>
                    <select defaultValue={'name'} name="sortField" onChange={onDetailSearchInputChange}>
                        <option value='name' >Name</option>
                        <option value='price' >Price</option>
                        <option value='soldAmount' >Sold amount</option>
                    </select>
                    <div>
                        <input type="radio" onChange={onDetailSearchInputChange} name="sortOrder" value="asc" defaultChecked/><label>Ascending </label>
                        <input type="radio" onChange={onDetailSearchInputChange} name="sortOrder" value="decs"/><label>Descending </label>
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
                                    <th style={{ width: '30%' }}>Id</th><th>Name</th><th>Category</th><th>Description</th><th>Price</th><th>Sold amount</th><th>Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {res.map((product) => (<tr key={product.id}><td>{product.id}</td><td>{product.name}</td>
                                    <td>{product.categories.map((cat, idx) => {
                                        if (idx == product.categories.length - 1) {
                                            return cat.name
                                        }
                                        return cat.name + ' > '
                                    })}</td><td>{product.description}</td><td>{product.price}</td><td>{product.soldAmount}</td>
                                    <td className="centerChildren"><button className="centerChildren" onClick={() => { navigate('/admin/products/product/' + product.id) }}><AiOutlineEdit /></button></td></tr>))}
                            </tbody>
                        </table>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>

            </section>
        </article>)
}