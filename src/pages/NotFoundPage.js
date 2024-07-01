import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { webName } from "../config";


export default function NotFoundPage() {
    return (
        <div className='authPage'>
            <div style={{ paddingTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className='neonText' >404</div>
                <div className="neonLabel">Page is not found...</div>

                <div  style={{marginTop:'130px'}}>
                <div className="glow">back to</div>
                    <Link style={{marginTop:'15px', fontFamily:'Arial, sans-serif'}} to='/' className='glow header_logo'>{webName}</Link>
                    </div>
            </div>
            

            {/* <div style={{ marginTop: '12px' }}><span to='/' className='header_logo'>BkShop</span></div> */}
            {/* <div style={{ textAlign: 'center' }}><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></div>
            <div style={{display:'flex', justifyContent:'center', marginTop:'40px'}}><div className="neonLabel">Page is loading...</div></div> */}
        </div>

    )
}