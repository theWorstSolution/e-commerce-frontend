import { useEffect, useState, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { createProduct } from "../../services/productService";
import { getChildrenCategory, createCategory } from "../../services/categoryService";
import categoryService from "../../services/categoryService";
import Creatable from 'react-select/creatable';
import { BsBell, BsPlusLg, BsSearch, BsPersonCircle, BsArrowLeft } from "react-icons/bs";


export default function CreateProduct() {
    const { setCurrentTab } = useOutletContext()
    const [inputs, setInputs] = useState({pictures:['']});
    const [categoriesAtLevel, setCategoriesAtLevel] = useState([[{id: categoryService.rootCategoryId, name:'root'}]])  // có id, name
    const [catsSelected, setCatsSelected] = useState([{value: categoryService.rootCategoryId, label:'root'}])    // có value và label
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if(name.slice(0,7)=='picture'){
            inputs.pictures[parseInt(name.slice(7,undefined))] = value
        }else{
            setInputs(values => ({ ...values, [name]: value }))
        }
    }
    const [morePicturesField, setMorePicturesField] = useState([<input type="url" name={'picture0'} onChange={handleChange}/>])
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const temp = inputs.pictures.filter((picture)=>picture!='')
        if(temp.length==0){
            alert('must have at least 1 picture')
            return
        }
        inputs.pictures = temp
        const body = {
            ...inputs,
            categories: catsSelected.map((catSelected) => ({id:catSelected.value, name:catSelected.label}))
        }
        console.log(body);
        createProduct(body).then((res) => console.log(res))
    }
    useEffect(() => {
        setCurrentTab('Product')
        getChildrenCategory(categoryService.rootCategoryId).then(({data: rootChildren}) => {
            setCategoriesAtLevel((categoriesAtLevel) => {
                return [...categoriesAtLevel, rootChildren]
            })
        })
    }, [])
    return (<article>
        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name='name' onChange={handleChange} />
            <label>Price</label>
            <input type="number" name='price' onChange={handleChange} />
            <label>Description</label>
            <input type="text" name='description' onChange={handleChange} />
            <label>Pictures</label>
            {morePicturesField}
            <button onClick={(e)=>{
                e.preventDefault()
                inputs.pictures.push('')
                setMorePicturesField([...morePicturesField,<input type="url" name={'picture'+(inputs.pictures.length-1)} onChange={handleChange}/>])
            }}><BsPlusLg/></button>
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
        </form>
    </article>)
}