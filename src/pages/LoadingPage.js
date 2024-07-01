import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { webName } from "../config";


export default function LoadingPage() {
    return (
        <div className='authPage'>
            <div style={{ paddingTop: '30px', paddingBottom: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className='neonText' >
                    <div>Welcome to</div>
                    <div style={{ marginTop: '12px' }}><span to='/' className='header_logo'>{webName}</span></div>
                </div>
            </div>
            <div style={{ textAlign: 'center' }}><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></div>
            <div style={{display:'flex', justifyContent:'center', marginTop:'40px'}}><div className="neonLabel">Page is loading...</div></div>
        </div>

    )
}