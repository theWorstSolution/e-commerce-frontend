import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import categoryService from "../services/categoryService";
import { Link } from "react-router-dom";
import { Card } from 'antd';
import {SampleNextArrow, SamplePrevArrow} from './SlickerArrow'
const { Meta } = Card;

/**
 * 
 * @param onClickCategory (catId)=>{} 
 * @returns 
 */
function HomeSlicker({ onClickRecommend, onClickCategory }) {
    // display categories row to choose
    const [mainCategories, setMainCategories] = useState()
    useEffect(() => {
        categoryService.getChildrenCategory(categoryService.rootCategoryId).then(({ data }) => {
            // console.log(data);
            setMainCategories(data)
        })
    }, [])
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
        nextArrow: <SamplePrevArrow />,
        prevArrow: <SampleNextArrow />,
    };
    return (
        <div>{mainCategories && <div className="categoryCard">
            <Slider {...settings}>
                <div >
                            <Card
                                onClick={onClickRecommend}
                                hoverable
                                className="ripple"
                                style={{margin:'5px 10px'}}
                                cover={<img className="" src='https://img.freepik.com/premium-vector/recommend-icon-banner-recommended-with-thumb-up_186930-1010.jpg' 
                                    style={{ objectFit:'contain', height:'100px', textAlign:'center' }} />}
                            >
                                <Meta className="" title={<p style={{whiteSpace:'normal', textAlign:'center', height:'51px'}}>Recommended products</p>}  />
                            </Card>
                        </div>
                {mainCategories?.map((cat) => (
                    
                        <div>
                            <Card
                                key={cat.id}
                                onClick={() => {
                                    onClickCategory(cat.id)
                                }}
                                hoverable
                                className="ripple"
                                style={{margin:'5px 10px'}}
                                cover={<img className="" src={cat.picture} style={{ objectFit:'contain', height:'100px', textAlign:'center' }} />}
                            >
                                <Meta title={<p style={{whiteSpace:'normal', textAlign:'center', height:'51px'}}>{cat.name}</p>} />
                            </Card>
                        </div>
                    ))}
            </Slider>
        </div>}</div>
    );
}

export default HomeSlicker;
