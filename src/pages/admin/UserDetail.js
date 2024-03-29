import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { getUser } from "../../services/userService";

export default function UserDetail(){
    const {userId} = useParams()
    const {setCurrentTab} = useOutletContext()
    const [user,setUser] = useState()
    useEffect(()=>{
        setCurrentTab('User')
        getUser(userId).then((res)=>{
            setUser(res.data)
            console.log(res.data);
        })
    },[])
    return(<div>{user?<article>
        <form>
            <label>Id</label>
            <input type="text" readOnly value={user.id}/>
            <label>name</label>
            <input type="text" value={user.name}/>
            <label>Email</label>
            <input type="email" value={user.email}/>
            <label>Role</label>
            <select>
                <option value='user' selected={user.role==='user'}>User</option>
                <option value='admin' selected={user.role==='admin'}>Admin</option>
            </select>
            <input type="submit"/>
        </form>
    </article>:'Loading'}</div>)
}