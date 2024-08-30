import { useEffect, useState, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { createProduct, updateProduct } from "../../services/productService";
import categoryService, { getChildrenCategory, createCategory } from "../../services/categoryService";
import productService from "../../services/productService";
import Creatable from 'react-select/creatable';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";
import { message } from "antd";


export default function EditProduct() {
    const { productId } = useParams()
    // const { setCurrentTab } = useOutletContext()
    const [inputs, setInputs] = useState({});
    const [categoriesAtLevel, setCategoriesAtLevel] = useState([]) // element = mảng các object cat có id, name
    const [catsSelected, setCatsSelected] = useState([])    // có value và label
    const [product, setProduct] = useState()
    const [morePicturesField, setMorePicturesField] = useState()
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if(name.slice(0,7)=='picture'){
            inputs.pictures[parseInt(name.slice(7,undefined))] = value
            // setInputs(values => ({ ...values, pictures: [value] }))
        }else{
            setInputs(values => ({ ...values, [name]: value }))
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        inputs.pictures = inputs.pictures.filter((picture)=>picture!='')
        const body = {
            ...inputs,
            categories: catsSelected.map((catSelected) => ({id:catSelected.value, name:catSelected.label}))
        }
        console.log('patch data');
        console.log(body);
        updateProduct(productId, body).then((res) => {console.log(res); message.success('Successful!')})
    }
    useEffect(() => {
        // setCurrentTab('Products')
        productService.getProduct(productId).then(async ({ data: product }) => {
            console.log('product: ' + JSON.stringify(product));
            setProduct(product)
            const categories = product.categories
            setCatsSelected(categories.map((category) => ({ value: category.id, label: category.name })));
            const childrenCategories = await Promise.all(product.categories.map(async (category) => {
                return (await getChildrenCategory(category.id)).data;
            }));
            childrenCategories.unshift([{ id: categoryService.rootCategoryId, name: 'root' }]);
            setCategoriesAtLevel(childrenCategories);
            setInputs({pictures: [...product.pictures]})
        })
    }, [])
    return (<article>
        {product && <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <label>Id</label>
            <input type="text" readOnly defaultValue={productId} />
            <label>Name</label>
            <input type="text" name='name' onChange={handleChange} defaultValue={product.name} />
            <label>Price</label>
            <input type="number" name='price' onChange={handleChange} defaultValue={product.price} />
            <label>Description</label>
            <textarea rows={5} name='description' onChange={handleChange} defaultValue={product.description}/>
            <label>Pictures</label>
            {product.pictures.map((picture, idx)=><input key={picture} type="url" name={'picture'+idx} onChange={handleChange} defaultValue={picture} />)}
            {morePicturesField}
            <button onClick={(e)=>{
                e.preventDefault()
                inputs.pictures.push('')
                if(!morePicturesField){
                    setMorePicturesField([<input type="url" name={'picture'+(inputs.pictures.length-1)} onChange={handleChange}/>])
                }else{
                    setMorePicturesField([...morePicturesField,<input type="url" name={'picture'+(inputs.pictures.length-1)} onChange={handleChange}/>])
                }
            }}><BsPlusLg/></button>
            <label>Sold amount</label>
            <input type="number" readOnly defaultValue={product.soldAmount} />
            <label>Category</label>
            <div>
                {categoriesAtLevel && categoriesAtLevel.map((catsAtLevel, idx) => {
                    return (<Creatable
                        key={catsSelected[idx]?.value}
                        isClearable
                        onChange={async (newSelected) => {
                            console.log('trigger onchange');
                            console.log('new value: ' + JSON.stringify(newSelected));
                            //if xóa lựa chọn
                            if (!newSelected) {
                                setCatsSelected((catsSelected) => {
                                    const newCatsSelected = [...catsSelected]
                                    newCatsSelected.splice(idx);
                                    return newCatsSelected
                                })

                                setCategoriesAtLevel((categoriesAtLevel) => {
                                    const newCatsAtLevel = [...categoriesAtLevel]
                                    newCatsAtLevel.splice(idx + 1)
                                    return newCatsAtLevel
                                })
                                return
                            }
                            if (newSelected.__isNew__) {
                                console.log('is new');
                                const newCategory = {
                                    name: newSelected.value,
                                    ancestors: catsSelected.slice(0, idx).map((catSelected) => catSelected.value)
                                }
                                const { data } = await createCategory(newCategory)
                                console.log('createCategory: ' + JSON.stringify(data));
                                setCategoriesAtLevel((categoriesAtLevel) => {
                                    const newCatsAtLevel = [...categoriesAtLevel]
                                    newCatsAtLevel.splice(idx + 1)
                                    newCatsAtLevel[idx].push(data)
                                    newCatsAtLevel.push([])
                                    return newCatsAtLevel
                                })
                                setCatsSelected((catsSelected) => {
                                    const newCatsSelected = [...catsSelected]
                                    newCatsSelected.splice(idx);
                                    newCatsSelected.push({ value: data.id, label: data.name })
                                    console.log('newCatsSelected: ' + JSON.stringify(newCatsSelected));
                                    return newCatsSelected
                                })
                                console.log('catsSelected: ' + JSON.stringify(catsSelected));
                                return
                            }

                            setCatsSelected((catsSelected) => {
                                const newCatsSelected = [...catsSelected]
                                newCatsSelected[idx] = newSelected
                                newCatsSelected.splice(idx + 1)
                                console.log('newCatsSelected: ' + JSON.stringify(newCatsSelected));
                                return newCatsSelected
                            })

                            const { data: childrenCats } = await getChildrenCategory(newSelected.value)
                            // console.log(childrenCats);
                            setCategoriesAtLevel((categoriesAtLevel) => {
                                const newCatsAtLevel = [...categoriesAtLevel]
                                newCatsAtLevel[idx + 1] = childrenCats;
                                newCatsAtLevel.splice(idx + 2)
                                console.log('categoriesAtLevel: ' + JSON.stringify(newCatsAtLevel));
                                return newCatsAtLevel
                            })
                        }}
                        options={catsAtLevel.map((cat) => ({ value: cat.id, label: cat.name }))}
                        value={catsSelected[idx]}
                    />)
                })}
            </div>
            <input type="submit" />
        </form>}
    </article>)
}