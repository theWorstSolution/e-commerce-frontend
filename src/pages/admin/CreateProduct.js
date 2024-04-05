import { useEffect, useState, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { createProduct } from "../../services/productService";
import { getChildrenCategory, createCategory } from "../../services/categoryService";
import Creatable from 'react-select/creatable';


export default function CreateProduct() {
    const { setCurrentTab } = useOutletContext()
    const [inputs, setInputs] = useState({});
    const [categoriesAtLevel, setCategoriesAtLevel] = useState([])
    const catsSelected = useRef([])
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputs);
        createProduct(inputs).then((res) => console.log(res))
    }
    useEffect(() => {
        async function foo() {
            setCurrentTab('Product')
            const { data: rootChildren } = await getChildrenCategory('root')
            setCategoriesAtLevel((categoriesAtLevel) => {
                return [...categoriesAtLevel, rootChildren]
            })
        }
        foo();
    }, [])
    return (<article>
        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name='name' onChange={handleChange} />
            <label>Price</label>
            <input type="number" name='price' onChange={handleChange} />
            <label>Description</label>
            <input type="text" name='description' onChange={handleChange} />
            <label>Picture</label>
            <input type="url" name='picture' onChange={handleChange} />
            <label>Category</label>
            <div>
                {categoriesAtLevel && categoriesAtLevel.map((catsAtLevel, idx) => {
                    return (<Creatable
                        key={catsAtLevel}
                        isClearable
                        onChange={async (newSelected) => {
                            // console.log('trigger');
                            // console.log('new value: ' + JSON.stringify(newSelected));
                            if (newSelected.__isNew__) {
                                const newCategory = {
                                    name: newSelected.value,
                                    ancestors: catsSelected.current.slice(0, idx)
                                }
                                const { data } = await createCategory(newCategory)
                                console.log('createCategory: ' + data);
                                setCategoriesAtLevel((categoriesAtLevel) => {
                                    const newCatsAtLevel = [...categoriesAtLevel]
                                    newCatsAtLevel.splice(idx + 1)
                                    newCatsAtLevel[idx].push(data)
                                    newCatsAtLevel.push([])
                                    return newCatsAtLevel
                                })
                                catsSelected.current.splice(idx);
                                catsSelected.current.push(data.id)
                                return
                            }
                            //if xóa lựa chọn
                            if (!newSelected) {
                                catsSelected.current.splice(idx)
                                setCategoriesAtLevel((categoriesAtLevel) => {
                                    const newCatsAtLevel = [...categoriesAtLevel]
                                    newCatsAtLevel.splice(idx + 1)
                                    return newCatsAtLevel
                                })
                                return
                            }
                            catsSelected.current[idx] = newSelected.value
                            catsSelected.current.splice(idx + 1)
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
                    // onCreateOption={async (inputValue)=>{
                    //     const newCategory = {
                    //         name: inputValue,
                    //         ancestors: catsSelected.current.slice(0,idx)
                    //     }
                    //     const {data} = await createCategory(newCategory)
                    //     setCategoriesAtLevel((categoriesAtLevel) => {
                    //         const newCatsAtLevel = [...categoriesAtLevel]
                    //         newCatsAtLevel.splice(idx + 1)
                    //         return newCatsAtLevel
                    //     })
                    //     catsSelected.current.splice(idx);
                    //     catsSelected.current.push(data.id)
                    // }}
                    />)
                })}
            </div>
            <input type="submit" />
        </form>
    </article>)
}