import { useState, useContext, useEffect } from "react";
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
    useEffect(() => {
        if (user) {
            const eventSource = new EventSource('http://localhost:3000/v1/users/user/' + user.id + '/subcribe-notifications');

            eventSource.onmessage = (event) => {
                console.log(event);
                const notificationData = JSON.parse(event.data);
                if (notificationData.type == 'fetchNotis') {
                    // case has no noti
                    if(!notificationData.resNotis){setHasMoreNotis(false); return}
                    const newNotis = [...notifications, ...notificationData.resNotis]
                    setNotifications(newNotis)
                    if (notificationData.hasMore) { setHasMoreNotis(true) } else { setHasMoreNotis(false) }
                }else if(notificationData.type == 'noOfNotSeenNoti'){
                    setNoOfNotSeenNoti(notificationData.noOfNotSeenNoti)
                }else {
                    const newNotifications = [notificationData, ...notifications]
                    setNotifications(newNotifications)

                    setNoOfNotSeenNoti(noOfNotSeenNoti+1)
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
                return (<div style={{backgroundColor:!noti.hasSeen&&'red'}}>New order: <Link to={'/admin/orders/order/' + noti.orderId}>User {noti.username} has bought {noti.amount} x {noti.productName}</Link></div>)
                break;

        }
    }

    return (<div onMouseLeave={()=>{
        if(noOfNotSeenNoti!=0){
            userService.setHasSeenAllNotis()

            setNoOfNotSeenNoti(0)

            const newNotis = [...notifications]
            for(let noti of newNotis){
                if(noti.hasSeen){break}
                else{noti.hasSeen=true}
            }
            setNotifications(newNotis)
        }
    }} className='centerChildren header_noti' style={{ position: 'relative' }}>
        <span style={{position:'relative', display:'inline-block'}}>
            <BsBell />
            {noOfNotSeenNoti>0 && <span style={{display:'flex', justifyContent:'center',alignItems:'center' ,position:'absolute', top:'-5px', right:'-4px', fontSize:'12px', borderRadius:'50%', backgroundColor:'white',height:'12px',width:'12px'}}>
                {noOfNotSeenNoti}
            </span>}
        </span>
        Thông báo
        <div style={{ position: 'absolute', top: '100%' }} className='header_noti_dropdown'>
            {notifications && <ul style={{ listStyleType: 'none', padding: 0 }} className="header_noti_ul">
                {notifications.map((noti) => <li key={noti._id}>
                    {renderNoti(noti)}
                    
                </li>)}

            </ul>}
            {hasMoreNotis && <Link onClick={() => {
                const { data: notificationData } = userService.fetchNotis();
                // case has no noti
                if(!notificationData.resNotis){setHasMoreNotis(false); return}
                const newNotis = [...notifications, ...notificationData.resNotis]
                setNotifications(newNotis)
                if (notificationData.hasMore) { setHasMoreNotis(true) } else { setHasMoreNotis(false) }
            }}>More</Link>}
        </div>
    </div>)
}