import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getUsers } from "../../services/userService";
import { AiOutlineEdit, AiOutlineDelete  } from "react-icons/ai";

export default function UserTabContent() {
    const { onDetailSearchSubmit, onGeneralSearchSubmit, onAdd, onBack, setDetailSearchForm, setPagiProps, setCurrentTab } = useOutletContext();
    const [res,setRes] = useState()
    useEffect(() => {
        setCurrentTab('User')
        getUsers().then((response) => {
            console.log(response)
            setRes(response.data.results)
            setPagiProps((pagiProps)=>({
                ...pagiProps,
                count: response.data.totalPages,
                page: response.data.page
            }))
        })
        
        //TODO: xem cấu trúc res để làm bảng
        setDetailSearchForm(<div><label>Tên</label>
            <input /></div>)
    }, [])
    function deleteUser(user){

    }

    return(<div style={{width:'100%'}}>{res && 
    <table style={{width:'100%'}}>
        <thead>
            <tr>
                <th style={{width:'30%'}}>Id</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th>
            </tr>
        </thead>
        <tbody>
            {res.map((user)=>(<tr><td>{user.id}</td><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
            <td className="centerChildren"><button className="centerChildren"><AiOutlineEdit /></button><button onClick={deleteUser} className="centerChildren"><AiOutlineDelete /></button></td></tr>))}
            {/* TODO: on edit -> navigate ra trang xem detail user */}
        </tbody>
    </table>}
    </div>)
}