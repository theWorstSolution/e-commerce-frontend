import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

export default function TestPage() {
    let { user, setUser } = useContext(globalContext);
    const onClick = function () {
    }

    // test websocket
    // useEffect(() => {
    //     const ws = new WebSocket('ws://localhost:3000');

    //     ws.onopen = () => {
    //         console.log('Connected to WebSocket server');
    //         // To send a message
    //     ws.send('Hello from client');
    //     };

    //     ws.onmessage = (event) => {
    //         console.log('Received:', event.data);
    //     };

    // })

    useEffect(() => {
        if(typeof(EventSource) !== "undefined") {
            console.log( 'Yes! Server-sent events support!');
            // Some code.....
          }
        const eventSource = new EventSource('http://localhost:3000/v1/test/subcribe-notifications');

        eventSource.onmessage = (event) => {
            console.log('aaa');
            console.log(event);
            // const notificationData = JSON.parse(event.data);
            // Handle notification data, e.g., display notification to user
            // console.log(notificationData);
        };

        return () => {
            eventSource.close();
        };
    }, []);

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