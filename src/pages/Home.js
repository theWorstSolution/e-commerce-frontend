import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import HomeHeader from '../components/HomeHeader';
import { BsCaretRightFill, BsArrowRightCircle, BsArrowLeftCircle, BsStar } from "react-icons/bs";
import { useCallback } from 'react';
import categoryService from '../services/categoryService'
import { Link, useOutletContext } from "react-router-dom";
import { useNavigate, useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import Select from 'react-select';
import { Pagination } from '@mui/material';
import userService from '../services/userService';
import HomeDetailSearchForm from '../components/HomeDetailSearchForm';
import { Collapse, Divider } from 'antd';
import HomeSlicker from '../components/HomeSlicker';
import HomeProductGrid from '../components/HomeProductGrid';
import Footer from '../components/Footer';
const qs = require('qs')

export default function Home() {
  const { user } = useContext(globalContext);

  const [recommendInfo, setRecommendInfo] = useState()
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const [res, setRes] = useState()
  const [pagiProps, setPagiProps] = useState({
    boundaryCount: 1, //Number of always visible pages at the beginning and end.
    count: 1, // total page
    hideNextButton: false,
    hidePrevButton: false,
    page: 1, //current page
  });

  //
  const [resultsTitle, setResultsTitle] = useState()

  // logic display search result
  useEffect(() => {
    const initialGeneralSearchInput = searchParams.get('generalSearchInput')
    const initialPage = searchParams.get('page')
    let filter, options;
    if (initialGeneralSearchInput || initialGeneralSearchInput == '' || searchParams.size == 0 || (searchParams.size == 1 && searchParams.get('page'))) {
      filter = {
        $or: [
          { name: { $regex: initialGeneralSearchInput, $options: 'i' } },
          { 'categories.name': { $regex: initialGeneralSearchInput, $options: 'i' } },
          { description: { $regex: initialGeneralSearchInput, $options: 'i' } },
        ]
      }
      options = { page: initialPage }
      setResultsTitle('All products')
    } else if (searchParams.get('recommended-products')) {
      options = { page: initialPage }
      userService.getRecommendedProducts(options).then(({ data }) => {
        // console.log(data);
        setRes(data.results)
        setPagiProps((pagiProps) => ({
          ...pagiProps,
          count: data.totalPages,
          page: data.page
        }))
      })
      setResultsTitle('Recommended products')
      return;
    } else if ((searchParams.size == 1 || (searchParams.size == 2 && searchParams.get('page'))) && searchParams.get('categoryId') && searchParams.get('categoryId') != '') {
      filter = {
        'categories.id': searchParams.get('categoryId')
      }
      options = { page: initialPage }
      categoryService.getCategory(searchParams.get('categoryId')).then(({ data: category }) => { setResultsTitle(category.name) })
    } else {
      filter = {
        price: {}, soldAmount: {}
      }
      if (searchParams.get('name_description_category') != '' && searchParams.get('name_description_category')) {
        filter.$or = [];
        filter.$or.push({ name: { $regex: searchParams.get('name_description_category'), $options: 'i' } })
        filter.$or.push({ description: { $regex: searchParams.get('name_description_category'), $options: 'i' } })
        filter.$or.push({ 'categories.name': { $regex: searchParams.get('name_description_category'), $options: 'i' } })
      }
      if (searchParams.get('minPrice') != '' && searchParams.get('minPrice')) {
        filter.price.$gte = searchParams.get('minPrice')
      }
      if (searchParams.get('maxPrice') != '' && searchParams.get('maxPrice') != 'Infinity' && searchParams.get('maxPrice')) {
        filter.price.$lte = searchParams.get('maxPrice')
      }
      filter['categories.id'] = searchParams.get('categoryId')

      options = { sortBy: searchParams.get('sortBy') + ':' + searchParams.get('order'), page: initialPage }
      setResultsTitle('Search results')
    }
    console.log(filter);
    console.log(options);
    productService.getProducts(filter, options).then(({ data }) => {
      console.log(data);
      setRes(data.results)
      setPagiProps((pagiProps) => ({
        ...pagiProps,
        count: data.totalPages,
        page: data.page
      }))
    })
  }, [searchParams])

  const onChangePage = useCallback(async (event, page) => {
    setSearchParams((params) => {
      params.set("page", page)
      return params
    });
  }, [setSearchParams])

  useEffect(() => { console.log(recommendInfo); }, [recommendInfo])

  return (<div>
    <HomeHeader navigateLinkOnSearch='/products?' />
{res && <div>
    <section className='sectionCard'>
      <Collapse
        size='small'
        items={[
          {
            key: '1',
            label: 'Detail search',
            children: <HomeDetailSearchForm onSubmit={(formInputs) => {
              const newSearchParams = new URLSearchParams();
              for (let param in formInputs) {
                if (formInputs[param]) {
                  newSearchParams.set(param, formInputs[param]);
                }
              }
              setSearchParams(newSearchParams);
            }} />
          },
        ]}
      />
    </section>

    <section className='sectionCard'>
      <h2>Categories</h2>
      <HomeSlicker onClickRecommend={async () => {
        if(user){
          const { data } = await userService.genRecommendedProducts()
        setRecommendInfo(data)
        const newSearchParams = new URLSearchParams();
        newSearchParams.set("recommended-products", true);
        setSearchParams(newSearchParams);
        }else{
          navigate('/auth')
        }
        
      }}
        onClickCategory={(catId) => {
          const newSearchParams = new URLSearchParams();
          newSearchParams.set("categoryId", catId);

          setSearchParams(newSearchParams);
        }}
      />
    </section>

    <section className='sectionCard'>
      <h2>{resultsTitle}</h2>
      <div>
        <HomeProductGrid products={res}/>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>
      </div>
    </section>
    
    <Footer/> </div>}

    {recommendInfo && <section>
      <h2>Supervised membership table</h2>
      <table className='recommendedProductTable'><thead><tr>
        <th style={{ width: '200px' }}>Name</th><th >Price</th>
        <th >Rating</th><th >Sold amount</th>
        <th >Category</th><th >Category value</th><th>hasBeenBought</th>
        {recommendInfo.clustersList.map((cluster, idx) => <th>Cluster {idx}</th>)}
      </tr></thead>
        <tbody>
          {Object.entries(recommendInfo.productsList).map(([productId, product]) => <tr>
            <td >{product.name}</td>
            <td >{product.price.toFixed(5)}</td>
            <td >{product.rating.toFixed(5)}</td>
            <td >{product.soldAmount.toFixed(5)}</td>
            <td >{product.categories.map((cat, idx) => {
              if (idx == product.categories.length - 1) {
                return cat.name
              }
              return cat.name + ' > '
            })}</td>
            <td >{product.categoryValue.toFixed(5)}</td>
            <td>{product.hasBeenBought?'X':''}</td>
            {recommendInfo.clustersList.map((cluster, idx) => <td style={{ backgroundColor: (recommendInfo.u_[idx][productId] == 0) ? 'transparent' : 'orange' }}>{recommendInfo.u_[idx][productId].toFixed(5)}</td>)}
          </tr>)}
        </tbody>
      </table>
      <p><em>Iterate: </em> {recommendInfo.iterate}</p>
      <p><em>Error: </em> {recommendInfo.error.toFixed(5)}</p>
      <ul>
        {recommendInfo.clustersList.map((cluster, idx) => <li>
          <h2>Cluster {idx}</h2>
          <h3>Center</h3>
          <table className='recommendedProductTable'>
            <thead><tr><th>Price</th><th>Rating</th><th>Sold amount</th><th>Category value</th></tr></thead>
            <tbody><tr><td>{cluster.center.price.toFixed(5)}</td><td>{cluster.center.rating.toFixed(5)}</td><td>{cluster.center.soldAmount.toFixed(5)}</td><td>{cluster.center.categoryValue.toFixed(5)}</td></tr></tbody>
          </table>
          <h3>Member</h3>
          <table style={{ width: '100%' }} className='recommendedProductTable'>
            <thead><tr><th style={{ width: '200px' }}>Name</th><th >Price</th>
              <th >Rating</th><th >Sold amount</th>
              <th >Category</th><th >Category value</th>
              <th >supervised Membership</th>
              <th >membership</th><th >distanceToCenter</th>
              <th >hasBeenBought</th>
              <th >isRecommended</th>
            </tr></thead>
            <tbody>
              {cluster.productsId.map((productId) => (<tr style={{
                backgroundColor: recommendInfo.productsList[productId].isRecommended ? 'lightgreen' : (recommendInfo.productsList[productId].hasBeenBought ? 'orange' : null)
              }}>
                <td >{recommendInfo.productsList[productId].name}</td>
                <td >{recommendInfo.productsList[productId].price.toFixed(5)}</td>
                <td >{recommendInfo.productsList[productId].rating.toFixed(5)}</td>
                <td >{recommendInfo.productsList[productId].soldAmount.toFixed(5)}</td>
                <td >{recommendInfo.productsList[productId].categories.map((cat, idx) => {
                  if (idx == recommendInfo.productsList[productId].categories.length - 1) {
                    return cat.name
                  }
                  return cat.name + ' > '
                })}</td>
                <td >{recommendInfo.productsList[productId].categoryValue.toFixed(5)}</td>
                <td >{recommendInfo.productsList[productId].supervisedMembership.toFixed(5)}</td>
                <td >{recommendInfo.productsList[productId].membership.toFixed(5)}</td>
                <td >{recommendInfo.productsList[productId].distanceToCenter.toFixed(5)}</td>
                <td >{recommendInfo.productsList[productId].hasBeenBought ? 'X' : ''}</td>
                <td >{recommendInfo.productsList[productId].isRecommended ? 'X' : ''}</td>
              </tr>))}
            </tbody>
          </table>

        </li>)
        }
      </ul>
    </section>}
  </div>)
  
}