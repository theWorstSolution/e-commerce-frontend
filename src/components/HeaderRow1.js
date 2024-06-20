import AccountDropdown from "./AccountDropdown";
import NotificationBell from "./NotificationBell";


export default function HeaderRow1(){

    return (
        <ul className='horizontalUl mock' style={{ justifyContent: 'flex-end'}}>
                    <li className='centerChildren'><NotificationBell/></li>
                    <li className='centerChildren'><AccountDropdown/></li>
                </ul>
    )
}