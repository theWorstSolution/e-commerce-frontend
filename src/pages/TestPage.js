import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

export default function TestPage() {
    let { user, setUser } = useContext(globalContext);
    const [person, setPerson] = useState({
        name: 'Niki de Saint Phalle',
        artwork: {
          title: 'Blue Nana',
          city: 'Hamburg',
          image: 'https://i.imgur.com/Sd1AgUOm.jpg',
        }
      });
    const [state, setState] = useState({a:[1,2,3], b:{x:'y'}})
    const onClick = function () {
        console.log('click');
        const state1 = {...state}
        state1.a.push(4)
        setState(state1) 
        
        // state.a.push(4)
        // state.c = 2
        // setState(state)
    }
    const onClick1 = function () {
        console.log('click1');
        const nextPer = {...person}
        nextPer.artwork.city = 'hanoi'
        setPerson(nextPer)
    }

    useEffect(()=>{
        console.log('state change');
        console.log(state);
    },[state])

    useEffect(()=>{
        console.log('person change');
        console.log(person);
    },[person])

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