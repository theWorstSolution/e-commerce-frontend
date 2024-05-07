import { useState, useContext, useEffect } from "react";
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft, BsCart3 } from "react-icons/bs";
import { globalContext } from '../contexts/globalContext';

export default function NotificationBell() {
    const { user } = useContext(globalContext);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/v1/users/user/subcribe-notifications');

        eventSource.onmessage = (event) => {
            console.log(event);
            // const notificationData = JSON.parse(event.data);
            // Handle notification data, e.g., display notification to user
            // console.log(notificationData);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const [notifications, setNotifications] = useState('abcd')
    return (<div className='centerChildren header_noti' style={{ position: 'relative' }}><BsBell />Thông báo
        <div style={{ position: 'absolute', top: '100%' }} className='header_noti_dropdown'>
                {notifications && <ul style={{ listStyleType: 'none', padding: 0 }} className="header_noti_ul">
                    <li>{notifications}</li>
                    
                </ul>}
        </div>
    </div>)
}