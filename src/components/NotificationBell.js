import { useState, useContext, useEffect } from "react";
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft, BsCart3 } from "react-icons/bs";
import { globalContext } from '../contexts/globalContext';
import { Link } from "react-router-dom";

export default function NotificationBell() {
    const { user } = useContext(globalContext);
    const [notifications, setNotifications] = useState([])
    useEffect(() => {
        if (user) {
            const eventSource = new EventSource('http://localhost:3000/v1/users/user/' + user.id + '/subcribe-notifications');

            eventSource.onmessage = (event) => {
                console.log(event);
                const notificationData = JSON.parse(event.data);
                if (notificationData.type == 'allNotis') {
                    setNotifications(notificationData.allNotis)
                } else {
                    const newNotifications = [...notifications]
                    newNotifications.push(notificationData)
                    setNotifications(newNotifications)
                }
                // Handle notification data, e.g., display notification to user
                // console.log(notificationData);
            };

            return () => {
                eventSource.close();
            };
        }
    }, [user]);

    function renderNoti(noti) {
        switch (noti.type) {
            case 'newOrder':
                return (<div>New order: {noti.orderId}</div>)
                break;

        }
    }

    return (<div className='centerChildren header_noti' style={{ position: 'relative' }}><BsBell />Thông báo
        <div style={{ position: 'absolute', top: '100%' }} className='header_noti_dropdown'>
            {notifications && <ul style={{ listStyleType: 'none', padding: 0 }} className="header_noti_ul">
                {notifications.map((noti) => <li key={noti._id}>
                    <Link to={'/admin/orders/order/'+noti.orderId}>User {noti.username} has bought {noti.amount} x {noti.productName}</Link>
                </li>)}

            </ul>}
        </div>
    </div>)
}