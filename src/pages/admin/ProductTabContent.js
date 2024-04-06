import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import  productService from "../../services/productService";
import { AiOutlineEdit, AiOutlineDelete  } from "react-icons/ai";

export default function ProductTabContent() {
    const { onDetailSearchSubmit, onGeneralSearchSubmit, onAdd, setDetailSearchForm, setPagiProps, setCurrentTab } = useOutletContext();
    const [res,setRes] = useState()
    useEffect(() => {
        setCurrentTab('Product')
        productService.getProducts().then((response) => {
            console.log(response)
            setRes(response.data.results)
            setPagiProps((pagiProps)=>({
                ...pagiProps,
                count: response.data.totalPages,
                page: response.data.page
            }))
        })
        
        //TODO: xem cấu trúc res để làm bảng
        setDetailSearchForm(<div><label>Tên</label>
            <input /></div>)
    }, [])
    function deleteUser(user){

    }

    return(<div style={{width:'100%'}}>{res && 
    <table style={{width:'100%'}}>
        <thead>
            <tr>
                <th style={{width:'30%'}}>Id</th><th>Name</th><th>Category</th><th>Price</th>
            </tr>
        </thead>
        <tbody>
            {res.map((product)=>(<tr><td>{product.id}</td><td>{product.name}</td><td>{product.categories[product.categories.length-1].name}</td>
            <td className="centerChildren"><button className="centerChildren"><AiOutlineEdit /></button><button onClick={deleteUser} className="centerChildren"><AiOutlineDelete /></button></td></tr>))}
            {/* TODO: on edit -> navigate ra trang xem detail user */}
        </tbody>
    </table>}
    </div>)
}