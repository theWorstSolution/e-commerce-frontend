import { useState, useContext, useEffect, useCallback, useRef } from "react";
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft, BsCart3 } from "react-icons/bs";
import { globalContext } from '../contexts/globalContext';
import { Link } from "react-router-dom";
import userService from "../services/userService";
import { FaRegBell } from "react-icons/fa6";
import { Popover, Button,List, Skeleton, Typography, Badge   } from "antd";
import utils from '../utils/utils'
const { Text } = Typography;
export default function NotificationBell() {
    const { user } = useContext(globalContext);
    const [loading, setLoading] = useState(false);
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


    const onLoadMore = async() => {
        setLoading(true);
        const { data: notificationData } = await userService.fetchNotis(notifications[notifications.length-1].id);
                // case has no noti
                if (!notificationData.resNotis) { setHasMoreNotis(false); return }
                const newNotis = [...notifications, ...notificationData.resNotis]
                setNotifications(newNotis)
                if (notificationData.hasMore) { setHasMoreNotis(true) } else { setHasMoreNotis(false) }
                
                setLoading(false);
                window.dispatchEvent(new Event('resize'));

      };

    const loadMore =
    hasMoreNotis && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

    const content = 
    <List
      style={{width:'350px', height:'350px', overflow:'auto'}}
      loading={!notifications}
      itemLayout="vertical"
      loadMore={loadMore}
      dataSource={notifications}
      renderItem={(noti) => {
        let title, description;
        switch (noti.type) {
            case 'newOrder':
                title = 'New order'
                description = <Link style={{textDecoration:'none'}} to={'/admin/orders/order/' + noti.orderId}>User {noti.username} has bought {noti.amount} x {noti.productName}</Link>
                break;
            case 'ChangeOrderStatusNoti':
                title = 'Order status has been changed'
                description = <span>Your order {noti.amount} x {noti.productName} has been set status from {noti.oldStatus} to {noti.newStatus} by admin</span>
                break;                
            default:
                title = 'Error'
                description = 'Error'
        }
        const createdAt = noti.createdAt;
        console.log(noti);
        return (
        <List.Item>
          <Skeleton title={false} loading={noti.loading} active>
          <div style={{display:'flex', justifyContent:'space-between'}}><Text type="secondary">{utils.convertDate(createdAt)}</Text> {!noti.hasSeen && <Badge color='blue' styles={{indicator:{marginRight:'10px'}}}/>}</div>
            <List.Item.Meta
              title={title}
              description={description}
            />
          </Skeleton>
        </List.Item>
        )
      }}
    />

    return (<Popover overlayClassName="notiPopover" placement="bottom" content={content} onOpenChange={(open) => {
        //if dong
        if(!open){
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
        }
    }}>
                <div className="centerChildren" style={{cursor:'default'}}>
                    <div style={{position:'relative'}}>
                        <BsBell className='headerIcon'/>
                        {noOfNotSeenNoti > 0 && <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '-5px', right: '-2px', fontSize: '12px', borderRadius: '50%', backgroundColor: 'white', height: '12px', width: '12px', color:'var(--shopee-color)' }}>
                            {noOfNotSeenNoti}
                        </span>}
                    </div>
                    Notifications
                </div>
            
    </Popover>)
}