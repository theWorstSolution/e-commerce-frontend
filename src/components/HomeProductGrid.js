import { Card } from "antd"
import Meta from "antd/es/card/Meta"
import { BsStar, BsStarFill } from "react-icons/bs"
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function HomeProductGrid({products}){
    const navigate = useNavigate()

    return <ul className='productGrid' style={{ listStyleType: 'none', padding:0 }}>
          {products?.map((product) => <li key={product.id}>
            <Card
              onClick={() => { navigate('/products/product/' + product.id) }}
              hoverable
              style={{}}
              cover={<img className="" src={product.pictures[0]}
                style={{ objectFit: 'cover', textAlign: 'center', height:'175px' }} />}
            >
              <Meta className="" title={<p className="productTitleEllipsis">{product.name}</p>}
                description={<div><div>{product.rating} <BsStar /></div>
                  <div>{product.price}đ</div>
                  <div>{product.soldAmount} sold</div></div>}
              />
            </Card>
          </li>)}
        </ul>

}