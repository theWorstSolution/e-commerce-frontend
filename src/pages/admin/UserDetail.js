import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../services/userService";
import { message } from "antd";

export default function UserDetail(){
    const {userId} = useParams()
    const {setCurrentTab} = useOutletContext()
    const [user,setUser] = useState()
    const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    // alert(inputs);
    updateUser(userId, inputs).then((res)=>{console.log(res);message.success('Successful!');})
  }


    useEffect(()=>{
        setCurrentTab('Users')
        getUser(userId).then((res)=>{
            setUser(res.data)
            console.log(res.data);
        })
    },[])
    return(<div>{user?<article>
        <form style={{display:'flex', flexDirection:'column'}} onSubmit={handleSubmit}>
            <label>Id</label>
            <input type="text" readOnly defaultValue={user.id}/>
            <label>name</label>
            <input type="text" name='name' defaultValue={user.name} onChange={handleChange}/>
            <label>Email</label>
            <input type="email" name='email' defaultValue={user.email} onChange={handleChange}/>
            <label>Role</label>
            <select defaultValue={user.role} name="role" onChange={handleChange}>
                <option value='user' >User</option>
                <option value='admin' >Admin</option>
            </select>
            <input type="submit"/>
        </form>
    </article>:'Loading'}</div>)
}