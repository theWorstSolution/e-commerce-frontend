import { useEffect, useState, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { createProduct, updateProduct } from "../../services/productService";
import categoryService, { getChildrenCategory, createCategory } from "../../services/categoryService";
import productService from "../../services/productService";
import Creatable from 'react-select/creatable';


export default function EditCategory() {
    const { categoryId } = useParams()
    const { setCurrentTab } = useOutletContext()
    const [inputs, setInputs] = useState({});
    const [category, setCategory] = useState()
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const body = {...inputs}
        console.log(body);
        categoryService.updateCategory(categoryId, body).then((res) => console.log(res))
    }
    useEffect(() => {
        setCurrentTab('Categories')
        categoryService.getCategory(categoryId).then(({ data: category }) => {
            console.log('category: ' + JSON.stringify(category));
            setCategory(category)
        })
    }, [])
    return (<article>
        {category && <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <label>Id</label>
            <input type="text" readOnly defaultValue={categoryId} />
            <label>Name</label>
            <input type="text" name='name' onChange={handleChange} defaultValue={category.name} />
            <label>Picture</label>
            <input type="url" name='picture' onChange={handleChange} defaultValue={category.picture} />
            <input type="submit" />
        </form>}
    </article>)
}