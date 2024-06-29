import { useOutletContext } from "react-router-dom";
import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import { updateUser } from "../services/userService";
import { message } from "antd";

export default function UserProfile(){
  const [messageApi, contextHolder] = message.useMessage();
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
        // messageApi.open({
        //   type: 'loading',
        //   content: 'Action in progress..',
        //   duration: 0,
        // });
        updateUser(user.id, inputs).then((res)=>{
          console.log(res);
          // messageApi.destroy();
          messageApi.open({
            type: 'success',
            content: 'Successful!',
          });
        })
      }
    return (<article className="sectionCard">{user &&  <div style={{display:'flex', gap:'20px'}}>
    {contextHolder}
        <img src={user.picture} style={{width:'20%'}}></img>
        <form style={{display:'flex', flexDirection:'column'}} onSubmit={handleSubmit}>
            <label>Id: </label> {user.id}
            <label>Name</label>
            <input type="text" name='name' defaultValue={user.name} onChange={handleChange}/>
            <label>Email</label>
            <input type="email" name='email' defaultValue={user.email} onChange={handleChange}/>
            <label>Role: </label> {user.role}
            <input className="confirmButton ripple" style={{marginTop:'20px'}} type="submit"/>
        </form>
    </div>}</article>)
    
}