import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import userService, { getUsers } from "../../services/userService";
import { AiOutlineEdit, AiOutlineDelete  } from "react-icons/ai";
import { Pagination } from '@mui/material';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft,BsTrash3  } from "react-icons/bs";
import categoryService from "../../services/categoryService";
const qs = require('qs')

export default function CategoryTabContent() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const { setCurrentTab } = useOutletContext();
    const [res,setRes] = useState()
    const [pagiProps, setPagiProps] = useState({
        boundaryCount: 1, //Number of always visible pages at the beginning and end.
        count: 1, // total page
        hideNextButton: false,
        hidePrevButton: false,
        page: 1, //current page
    });
    const [generalSearchInput,setGeneralSearchInput] = useState()
    const onGeneralSearchInputChange = useCallback((event)=>{
        setGeneralSearchInput(event.target.value)
    },[])
    useEffect(() => {
        setCurrentTab('Categories')
        const initialQuery = searchParams.get('generalSearchInput')
        const initialPage = searchParams.get('page')
        console.log('initialQuery');console.log(initialQuery);
        const filter = {
            name: { $regex: initialQuery, $options: 'i'},
        }
        const options = {page:initialPage, populate:'ancestors,children', sortBy: 'name'}
        categoryService.getCategories(filter,options).then(({data})=>{
            console.log(data);
        setRes(data.results)
        setPagiProps((pagiProps)=>({
            ...pagiProps,
            count: data.totalPages,
            page: data.page
        }))
        })
        
    }, [searchParams])
    const onAdd = useCallback(() => { navigate('/admin/categories/category') }, []);
    const onGeneralSearchSubmit = useCallback(async (e)=>{
        e.preventDefault()
       setSearchParams((params) => {
        params.set("generalSearchInput", generalSearchInput?generalSearchInput:'')
        params.delete('page')
        console.log(params);
        return params
    } );
    },[generalSearchInput])
    const onChangePage = useCallback(async (event, page)=>{
        setSearchParams((params) => {
            params.set("page", page)
            return params
        } );
    },[])
    return(
    <article className='admin_main'>
    <section className='admin_main_content'>
        <div>
            <form onSubmit={onGeneralSearchSubmit} style={{ display: 'flex', justifyContent: 'center' }}>
                <input type='search' name="generalSearchInput" onChange={onGeneralSearchInputChange}  defaultValue={searchParams.get('generalSearchInput')}/>
                <button type='submit' style={{ display: 'flex' }}><BsSearch /></button>
            </form>
            <button onClick={onAdd} style={{ marginLeft: 'auto', marginRight: 0, display: 'flex' }}><BsPlusLg /></button>
        </div>

        <div className='centerChildren'>
        {res && 
    <table style={{width:'100%'}}>
        <thead>
            <tr>
                <th style={{width:'30%'}}>Id</th><th>Name</th><th>Ancestors</th><th>Children</th><th>Action</th>
            </tr>
        </thead>
        <tbody>
            {res.map((category)=>(<tr key={category.id}><td>{category.id}</td><td>{category.name}</td><td>{category.ancestors.map((cat, idx) => {
                                        if (idx == category.ancestors.length - 1) {
                                            return cat.name
                                        }
                                        return cat.name + ' > '
                                    })}</td><td>{category.children.map((cat, idx) => {
                                        if (idx == category.children.length - 1) {
                                            return cat.name
                                        }
                                        return cat.name + ', '
                                    })}</td>
            <td className="centerChildren"><button className="centerChildren" onClick={()=>{navigate('/admin/categories/category/'+category.id)}}><AiOutlineEdit /></button></td></tr>))}
        </tbody>
    </table>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>

    </section>
</article>)
}