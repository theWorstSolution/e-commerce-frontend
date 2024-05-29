import { useState, useContext, useEffect, useCallback, useRef } from "react";
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft, BsCart3 } from "react-icons/bs";
import { globalContext } from '../contexts/globalContext';
import { Link } from "react-router-dom";
import userService from "../services/userService";
import NumberBadge from "./NumberBadge";

export default function NotificationBell() {
    const { user } = useContext(globalContext);
    const [notifications, setNotifications] = useState([])
    const [hasMoreNotis, setHasMoreNotis] = useState()
    const [noOfNotSeenNoti, setNoOfNotSeenNoti] = useState(0)
    let eventSource = useRef({})
    useEffect(() => {
        if (user) {
            eventSource.current = new EventSource('http://localhost:3000/v1/users/user/' + user.id + '/subcribe-notifications');
            // console.log('on message');
            // console.log(eventSource.current.onmessage);
            eventSource.current.onmessage = (event) => {
                const notificationData = JSON.parse(event.data);
                console.log(notificationData);
                if (notificationData.type == 'fetchNotis') {
                    // case has no noti
                    if (!notificationData.resNotis) { setHasMoreNotis(false); return }
                    const newNotis = [...notifications, ...notificationData.resNotis]
                    setNotifications(newNotis)
                    if (notificationData.hasMore) { setHasMoreNotis(true) } else { setHasMoreNotis(false) }
                } else if (notificationData.type == 'noOfNotSeenNoti') {
                    setNoOfNotSeenNoti(notificationData.noOfNotSeenNoti)
                } else {
                    const newNotifications = [notificationData, ...notifications]
                    setNotifications(newNotifications)
        
                    setNoOfNotSeenNoti(noOfNotSeenNoti + 1)
                }
            }
            return () => {
                eventSource.current.close(); 
            };
        }else{
            setNotifications([]); setNoOfNotSeenNoti(0); setHasMoreNotis(false)
        }
    }, [user?.uid]);
    // console.log('current');
    // console.log(eventSource.current);
    eventSource.current.onmessage = useCallback((event) => {
        const notificationData = JSON.parse(event.data);
        console.log(notificationData);
        if (notificationData.type == 'fetchNotis') {
            // case has no noti
            if (!notificationData.resNotis) { setHasMoreNotis(false); return }
            const newNotis = [...notifications, ...notificationData.resNotis]
            setNotifications(newNotis)
            if (notificationData.hasMore) { setHasMoreNotis(true) } else { setHasMoreNotis(false) }
        } else if (notificationData.type == 'noOfNotSeenNoti') {
            setNoOfNotSeenNoti(notificationData.noOfNotSeenNoti)
        } else {
            const newNotifications = [notificationData, ...notifications]
            setNotifications(newNotifications)

            setNoOfNotSeenNoti(noOfNotSeenNoti + 1)
        }
    }, [notifications])
    
    function renderNoti(noti) {
        switch (noti.type) {
            case 'newOrder':
                return (<div style={{ backgroundColor: !noti.hasSeen && 'red' }}>New order: <Link to={'/admin/orders/order/' + noti.orderId}>User {noti.username} has bought {noti.amount} x {noti.productName}</Link></div>)
            case 'ChangeOrderStatusNoti':
                return (<div style={{ backgroundColor: !noti.hasSeen && 'red' }}>
                    Your order {noti.amount} x {noti.productName} has been set status from {noti.oldStatus} to {noti.newStatus} by admin</div>)
            default:
                return (<div>OK</div>)
        }
    }

    return (<div onMouseLeave={() => {
        if (noOfNotSeenNoti != 0) {
            userService.setHasSeenAllNotis()

            setNoOfNotSeenNoti(0)

            const newNotis = [...notifications]
            for (let noti of newNotis) {
                if (noti.hasSeen) { break }
                else { noti.hasSeen = true }
            }
            setNotifications(newNotis)
        }
    }} className='centerChildren header_noti' style={{ position: 'relative' }}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
            <BsBell />
            {noOfNotSeenNoti > 0 && <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '-5px', right: '-4px', fontSize: '12px', borderRadius: '50%', backgroundColor: 'white', height: '12px', width: '12px' }}>
                {noOfNotSeenNoti}
            </span>}
        </span>
        Thông báo
        <div style={{ position: 'absolute', top: '100%' }} className='header_noti_dropdown'>
            <div className="header_noti_ul">
                {notifications && <ul style={{ listStyleType: 'none', padding: 0, width: '350px', maxHeight: '350px', overflow: 'auto' }} >
                    {notifications.map((noti) => <li key={noti._id}>
                        {renderNoti(noti)}

                    </li>)}

                </ul>}
                {hasMoreNotis && <button onClick={async() => {
                const { data: notificationData } = await userService.fetchNotis(notifications[notifications.length-1].id);
                // case has no noti
                if (!notificationData.resNotis) { setHasMoreNotis(false); return }
                const newNotis = [...notifications, ...notificationData.resNotis]
                setNotifications(newNotis)
                if (notificationData.hasMore) { setHasMoreNotis(true) } else { setHasMoreNotis(false) }
            }}>More</button>}
            <div style={{height:'10px', backgroundColor:'transparent'}}></div>
            </div>
            
        </div>
    </div>)
}