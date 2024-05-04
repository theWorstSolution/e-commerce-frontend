import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

export default function TestPage() {
    let { user, setUser } = useContext(globalContext);
    const onClick = function () {
    }
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            // To send a message
        ws.send('Hello from client');
        };

        ws.onmessage = (event) => {
            console.log('Received:', event.data);
        };

        

    })
    const [state, setState] = useState('x')
    return (
        <div>
            {/* <Headbar /> */}
            <div className='mock long-mock'>
                TEST PAGE
                <input value={state} onChange={(e) => { setState(e.target.value) }} />
                <button onClick={onClick}>test</button>
            </div>

        </div>
    )
}