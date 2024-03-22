import { globalContext } from '../contexts/globalContext';
import { useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

const dataSend = {
    name: 'Bard',
    language: 'JavaScript',
    framework: 'NodeJS',
};
export default function TestPage() {
    const {user} = useContext(globalContext);
    const onClick = async function () {
        // axios.post('http://localhost:3000/v1/test', dataSend)
        //     .then((response) => {
        //         // In ra response data
        //         console.log(response.data);
        //     })
        //     .catch((error) => {
        //         // Xử lý lỗi
        //         console.error(error);
        //     });

            

        const a = await axiosInstance({
            method: 'POST',
            url: '/v1/test',
            data: dataSend
        })
        console.log(a)
    }
    return (
        <div>
            {/* <Headbar /> */}
            <div className='mock long-mock'>
                TEST PAGE
                <button onClick={onClick}>test</button>
            </div>

        </div>
    )
}