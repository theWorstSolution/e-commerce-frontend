import { useEffect, useState, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { createProduct } from "../../services/productService";
import { getChildrenCategory, createCategory } from "../../services/categoryService";
import categoryService from "../../services/categoryService";
import Select from 'react-select';


export default function CreateCategory() {
    const { setCurrentTab } = useOutletContext()
    const [inputs, setInputs] = useState({});
    const [categoriesAtLevel, setCategoriesAtLevel] = useState([[{id: categoryService.rootCategoryId, name:'root'}]])  // có id, name
    const [catsSelected, setCatsSelected] = useState([{value: categoryService.rootCategoryId, label:'root'}])    // có value và label
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const ancestors = catsSelected.map((catSelected) => catSelected.value)
        const newCategory = {
            ...inputs, ancestors
        }
        createCategory(newCategory).then(({data})=>{console.log('createCategory: ' + JSON.stringify(data));})
    }
    useEffect(() => {
        setCurrentTab('Categories')
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
            <label>Picture</label>
            <input type="url" name='picture' onChange={handleChange} />
            <label>Ancestors</label>
            <div>
                {categoriesAtLevel && categoriesAtLevel.map((catsAtLevel, idx) => {
                    return (<Select
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