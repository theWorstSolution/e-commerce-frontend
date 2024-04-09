import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import userService, { getUsers } from "../../services/userService";
import { AiOutlineEdit, AiOutlineDelete  } from "react-icons/ai";
import { Pagination } from '@mui/material';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";

export default function UserTabContent() {
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
    const lastRequest = useRef({filter:null,options:null})
    useEffect(() => {
        setCurrentTab('Users')
        getUsers().then((response) => {
            console.log(response)
            setRes(response.data.results)
            setPagiProps((pagiProps)=>({
                ...pagiProps,
                count: response.data.totalPages,
                page: response.data.page
            }))
        })
        lastRequest.current = {filter:null,options:null}
    }, [])
    const onGeneralSearchSubmit = useCallback(async (e)=>{
        e.preventDefault()
        const filter = {
            $or:[
                {id: { $regex: generalSearchInput, $options: 'i' }},
                {name: { $regex: generalSearchInput, $options: 'i' }},
                {email: { $regex: generalSearchInput, $options: 'i' }},
                {role: { $regex: generalSearchInput, $options: 'i' }},
            ]
        }
        console.log('generalSearchInput: '+generalSearchInput);
        const {data} = await userService.getUsers(filter)
        console.log(data);
        setRes(data.results)
        setPagiProps((pagiProps)=>({
            ...pagiProps,
            count: data.totalPages,
            page: data.page
        }))
        lastRequest.current = {...lastRequest.current, filter}
    },[generalSearchInput])
    const onChangePage = useCallback(async (event, page)=>{
        lastRequest.current.options = {...lastRequest.current.options,page}
        const {data} = await userService.getUsers(lastRequest.current.filter, lastRequest.current.options)
        setRes(data.results)
        setPagiProps((pagiProps)=>({
            ...pagiProps,
            count: data.totalPages,
            page: data.page
        }))
    },[])
    return(
    <article className='admin_main'>
    <section className='admin_main_content'>
        <div>
            <form onSubmit={onGeneralSearchSubmit} style={{ display: 'flex', justifyContent: 'center' }}>
                <input type='search' name="generalSearchInput" onChange={onGeneralSearchInputChange} />
                <button type='submit' style={{ display: 'flex' }}><BsSearch /></button>
            </form>
        </div>

        <div className='centerChildren'>
        {res && 
    <table style={{width:'100%'}}>
        <thead>
            <tr>
                <th style={{width:'30%'}}>Id</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th>
            </tr>
        </thead>
        <tbody>
            {res.map((user)=>(<tr key={user.id}><td>{user.id}</td><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
            <td className="centerChildren"><button className="centerChildren" onClick={()=>{navigate('/admin/users/user/'+user.id)}}><AiOutlineEdit /></button></td></tr>))}
        </tbody>
    </table>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>

    </section>
</article>)
}