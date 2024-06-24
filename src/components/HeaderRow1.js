import AccountDropdown from "./AccountDropdown";
import NotificationBell from "./NotificationBell";


export default function HeaderRow1(){

    return (
        <ul className='horizontalUl' style={{ justifyContent: 'flex-end', gap:'10px', color:'white'}}>
                    <li ><NotificationBell/></li>
                    <li ><AccountDropdown/></li>
                </ul>
    )
}