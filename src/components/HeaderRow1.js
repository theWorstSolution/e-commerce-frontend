import AccountDropdown from "./AccountDropdown";
import NotificationBell from "./NotificationBell";
import { webName } from '../config';
import { useCallback, useEffect, useState, useRef, useContext } from "react";
import { globalContext } from '../contexts/globalContext';
import { Link } from "react-router-dom";

export default function HeaderRow1({style}){
    const { screenSize } = useContext(globalContext);
    
    return (<div>
    {screenSize.isMobile && <div className="centerChildren" style={{marginBottom:'10px',...style}}><Link to='/' className='header_logo'>{webName}</Link></div>}
        <ul className='horizontalUl headerRow1'>
                    <li ><NotificationBell/></li>
                    <li ><AccountDropdown/></li>
                </ul>
                </div>
    )
}