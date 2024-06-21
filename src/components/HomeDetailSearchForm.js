import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Slider, Select, Radio } from 'antd';
import categoryService from '../services/categoryService';
import SelectCategories from './SelectCategories';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};
const priceMarks = {
    0: '0',
    100000: '100.000đ',
    500000: '500.000đ',
    1000000: '1.000.000đ',
    2000000: '2.000.000đ',
    2500000: 'No limit',
};
const maxPriceMark = 2500000;


/**
 * @params onSubmit (formInputs) =>{set search params}
 */
const HomeDetailSearchForm = ({ onSubmit }) => {
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState({});
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [categoriesAtLevel, setCategoriesAtLevel] = useState([[{ id: categoryService.rootCategoryId, name: 'root' }]])  // có id, name
    const [catsSelected, setCatsSelected] = useState([categoryService.rootCategoryId])

    useEffect(() => {
        categoryService.getChildrenCategory(categoryService.rootCategoryId).then(({ data }) => {
            setCategoriesAtLevel((categoriesAtLevel) => {
                return [...categoriesAtLevel, data]
            })
        })
    }, [])

    // values = [min, max]
    const handleSliderChange = (values) => {
        const priceRange = values;
        const finalPriceRange = priceRange[1] === maxPriceMark ? [priceRange[0], Infinity] : priceRange;
        setPriceRange(finalPriceRange)
        // console.log('Form values:', { ...values, priceRange: finalPriceRange });
    };
    // Handle form changes
    const onValuesChange = (changedValues, allValues) => {
        // console.log('Changed Values:', changedValues);
        // console.log('All Values:', allValues);
        setFormValues(allValues);
    };

    // Handle form submission
    const onFinish = (values) => {
        const formInputs = {
            ...values, minPrice: priceRange[0], maxPrice: priceRange[1],
            categoryId: catsSelected[catsSelected.length - 1]
        }
        // console.log('formInputs ');
        // console.log(formInputs);
        onSubmit(formInputs)
    };

    // Handle form submission failure
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <Form
            {...layout}
            form={form}
            name="basic"
            initialValues={{
                sortBy: 'price',
                order: 'asc',
            }}
            onValuesChange={onValuesChange}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Name/description/category"
                name="name_description_category"
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Price Range"
                name="priceRange"
            >
                <Slider
                    range
                    marks={priceMarks}
                    min={0}
                    max={maxPriceMark}
                    step={10000}
                    defaultValue={priceRange}
                    onChangeComplete={handleSliderChange}
                />
            </Form.Item>

            <Form.Item
                label="Categories"
                name="categories"
            ><SelectCategories optionsAtLevel={categoriesAtLevel} valueAtLevel={catsSelected}
                onSelect={async (level, catId) => {
                    setCatsSelected((catsSelected) => {
                        const newCatsSelected = [...catsSelected]
                        newCatsSelected[level] = catId
                        newCatsSelected.splice(level + 1)
                        // console.log('newCatsSelected: ' + JSON.stringify(newCatsSelected));
                        return newCatsSelected
                    })

                    const { data: childrenCats } = await categoryService.getChildrenCategory(catId)
                    // console.log(childrenCats);
                    setCategoriesAtLevel((categoriesAtLevel) => {
                        const newCatsAtLevel = [...categoriesAtLevel]
                        newCatsAtLevel[level + 1] = childrenCats;
                        newCatsAtLevel.splice(level + 2)
                        // console.log('categoriesAtLevel: ' + JSON.stringify(newCatsAtLevel));
                        return newCatsAtLevel
                    })
                }}

                onClear={(level) => {
                    setCategoriesAtLevel((categoriesAtLevel) => {
                        const newCatsAtLevel = [...categoriesAtLevel]
                        newCatsAtLevel.splice(level + 1)
                        return newCatsAtLevel
                    })
                    setCatsSelected((catsSelected) => {
                        const newCatsSelected = [...catsSelected]
                        newCatsSelected.splice(level);
                        return newCatsSelected
                    })
                }}
                />
            </Form.Item>

            <Form.Item
                label="Sort By"
                name="sortBy"
            >
                <Select>
                    <Select.Option value="price">Price</Select.Option>
                    <Select.Option value="soldAmount">Sold Amount</Select.Option>
                    <Select.Option value="name">Name</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Order"
                name="order"
            >
                <Radio.Group>
                    <Radio value="asc">Ascending</Radio>
                    <Radio value="desc">Descending</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>


        </Form>
    );
};

export default HomeDetailSearchForm;
