import AccountDropdown from "./AccountDropdown";
import NotificationBell from "./NotificationBell";


export default function HeaderRow1(){

    return (
        <ul className='horizontalUl' style={{ justifyContent: 'flex-end', gap:'10px'}}>
                    <li className='centerChildren'><NotificationBell/></li>
                    <li className='centerChildren'><AccountDropdown/></li>
                </ul>
    )
}