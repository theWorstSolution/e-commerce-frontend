import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

export default function TestPage() {
    let { user, setUser } = useContext(globalContext);
    const [x, setX] = useState(null);
  const [y, setY] = useState(null);

  useEffect(() => {
    console.log('useEffect 1 - dependent on x:', x);
  }, [x]);

  useEffect(() => {
    console.log('useEffect 2 - dependent on y:', y);
  }, [y]);
let onClick, onClick1
    console.log('rerender');
    return (
        <div>
            {/* <Headbar /> */}
            <div className='mock long-mock'>
                TEST PAGE
                {/* <input value={state} onChange={(e) => { setState(e.target.value) }} /> */}
                <button onClick={onClick}>test</button>
                <button onClick={onClick1}>test1</button>
                {/* {state?.a?.map((element)=><p>{element}</p>)} */}
            </div>

        </div>
    )
}