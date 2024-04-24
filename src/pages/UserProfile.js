import { useOutletContext } from "react-router-dom";
import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import { updateUser } from "../services/userService";

export default function UserProfile(){
    const { setCurrentTab } = useOutletContext();
    const [inputs, setInputs] = useState({});
    setCurrentTab('Profile')
    const { user } = useContext(globalContext);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }
      const handleSubmit = (event) => {
        event.preventDefault();
        updateUser(user.id, inputs).then((res)=>{ console.log(res);alert('Updated successfully')})
      }
    return (<div>{user &&  <article style={{display:'flex'}}>
        <img src={user.picture}></img>
        <form style={{display:'flex', flexDirection:'column'}} onSubmit={handleSubmit}>
            <label>Id</label>
            <input type="text" readOnly defaultValue={user.id}/>
            <label>name</label>
            <input type="text" name='name' defaultValue={user.name} onChange={handleChange}/>
            <label>Email</label>
            <input type="email" name='email' defaultValue={user.email} onChange={handleChange}/>
            <label>Role</label>
            <input readOnly type="text" defaultValue={user.role}/>
            <input type="submit"/>
        </form>
    </article>}</div>)
    
}