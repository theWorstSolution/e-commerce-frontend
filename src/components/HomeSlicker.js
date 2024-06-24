import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import categoryService from "../services/categoryService";
import { Link } from "react-router-dom";
import { Card } from 'antd';
const { Meta } = Card;

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <div
            className="slickPrevArrow"
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '20px', height: '20px' }}
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
}

function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <div
            className="slickNextArrow"
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '20px', height: '20px' }}
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
}

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
        <div className="categoryCard">
            <Slider {...settings}>
                <div >
                            <Card
                                onClick={onClickRecommend}
                                hoverable
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
                                style={{margin:'5px 10px'}}
                                cover={<img className="" src={cat.picture} style={{ objectFit:'contain', height:'100px', textAlign:'center' }} />}
                            >
                                <Meta title={<p style={{whiteSpace:'normal', textAlign:'center', height:'51px'}}>{cat.name}</p>} />
                            </Card>
                        </div>
                    ))}
            </Slider>
        </div>
    );
}

export default HomeSlicker;
