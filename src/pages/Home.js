import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import HomeHeader from '../components/HomeHeader';
import { BsCaretRightFill, BsArrowRightCircle, BsArrowLeftCircle, BsStar } from "react-icons/bs";
import { useCallback } from 'react';
import categoryService from '../services/categoryService'
import { constant } from '../config';
import { Link, useOutletContext } from "react-router-dom";
import { useNavigate, useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
const qs = require('qs')

export default function Home() {
  const { user } = useContext(globalContext);
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

  // display categories row to choose
  const [mainCategories, setMainCategories] = useState()
  useEffect(() => {
    categoryService.getChildrenCategory(categoryService.rootCategoryId).then(({ data }) => {
      console.log(data);
      setMainCategories(data)
    })
  }, [])

  const [resultsTitle, setResultsTitle] = useState()
  // logic display search result
  useEffect(() => {
    const initialGeneralSearchInput = searchParams.get('generalSearchInput')
    const initialPage = searchParams.get('page')
    const categoryId = searchParams.get('categoryId')
    let filter, options;
    if (initialGeneralSearchInput || initialGeneralSearchInput == '' || searchParams.size == 0) {
      filter = {
        $or: [
          { name: { $regex: initialGeneralSearchInput, $options: 'i' } },
          { 'categories.name': { $regex: initialGeneralSearchInput, $options: 'i' } },
          { description: { $regex: initialGeneralSearchInput, $options: 'i' } },
        ]
      }
      options = { page: initialPage }
      setResultsTitle('Search results:')
    } else if (searchParams.size == 1 && categoryId) {
      filter = {
        'categories.id': categoryId
      }
      options = { page: initialPage }
      categoryService.getCategory(categoryId).then(({ data: category }) => { setResultsTitle(category.name) })
    } else {
      filter = {
        _id: {}, price: {}, soldAmount: {}
      }
      if (searchParams.get('id') != '') {
        filter._id = searchParams.get('id')
      }
      if (searchParams.get('minPrice') != '') {
        filter.price.$gte = searchParams.get('minPrice')
      }
      if (searchParams.get('maxPrice') != '') {
        filter.price.$lte = searchParams.get('maxPrice')
      }
      if (searchParams.get('minSoldAmount') != '') {
        filter.soldAmount.$gte = searchParams.get('minSoldAmount')
      }
      if (searchParams.get('maxSoldAmount') != '') {
        filter.soldAmount.$lte = searchParams.get('maxSoldAmount')
      }

      options = { sortBy: searchParams.get('sortField') + ':' + searchParams.get('sortOrder'), page: initialPage }
      setResultsTitle('Search results:')
    }
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
  }, [])

  const [detailSearchInput, setDetailSearchInput] = useState()
  const onDetailSearchInputChange = useCallback((event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDetailSearchInput(values => ({ ...values, [name]: value }))
  }, [])
  const onDetailSearchSubmit = useCallback(() => { }, [])



  const [accordionState, setAccordionState] = useState({
    state: 0, // 0: hidden, 1: show
    arrowStyle: {},
    contentStyle: { maxHeight: 0 }
  })
  const onClickAccordion = useCallback(() => {
    console.log(accordionState);
    if (accordionState.state == 0) {
      console.log('activate accordion');
      const newAccordionState = { ...accordionState }
      newAccordionState.state = 1;
      newAccordionState.arrowStyle = {
        transform: 'rotate(90deg)'
      }
      newAccordionState.contentStyle = { maxHeight: '50px' }
      console.log(newAccordionState);
      setAccordionState(newAccordionState)
    } else {
      console.log('deactivate accordion');
      setAccordionState((a) => {
        const newAccordionState = { ...a }
        newAccordionState.state = 0;
        newAccordionState.arrowStyle = null
        newAccordionState.contentStyle = { maxHeight: 0 }
        console.log(newAccordionState);
        return newAccordionState
      })
    }
  }, [accordionState])

  const [slickerStyle, setSlickerStyle] = useState({ translate: '0px' })
  const onSlideSlicker = function (e) {
    console.log(e)
    console.log(e.currentTarget.name);
    const newSlickerStyle = { ...slickerStyle }
    if (e.currentTarget.name == 'slideForward') {
      newSlickerStyle.translate = 'calc(' + newSlickerStyle.translate + ' - ' + 'var(--categoryCardWidth)' + ')'
    } else {
      newSlickerStyle.translate = 'calc(' + newSlickerStyle.translate + ' + ' + 'var(--categoryCardWidth)' + ')'
    }
    setSlickerStyle(newSlickerStyle)
  }

  const [productLists, setProductLists] = useState([])
  useEffect(() => {
    if (res) {
      const newProductLists = []
      for (let i = 0; i < res.length; i++) {
        if (!newProductLists[Math.floor(i / 2)]) {
          newProductLists[Math.floor(i / 2)] = []
        }
        newProductLists[Math.floor(i / 2)].push(res[i])
      }
      setProductLists(newProductLists)
    }
  }, [res])
  return (<div>
    <HomeHeader navigateLink='/products?' />
    <h2 onClick={onClickAccordion} style={{ display: 'flex', alignItems: 'center' }}><BsCaretRightFill style={{ transition: 'transform 1s ease-in-out', ...accordionState.arrowStyle }} />Detail search</h2>
    <form style={{ transition: 'max-height 1s ease-in-out', border: 'solid', overflow: 'hidden', ...accordionState.contentStyle }}>
      <label>Name, description:</label>
      <input type='search' />
      <button type='submit'>Submit</button>
    </form>
    <h2>Categories</h2>
    <section style={{ display: 'flex' }}>
      <button name='slideBack' onClick={onSlideSlicker}><BsArrowLeftCircle /></button>
      <div style={{ overflow: 'hidden' }}>
        {mainCategories && <ul className='horizontalUl' style={{ listStyleType: 'none', transition: 'translate 1s ease-in-out', ...slickerStyle }}>
          {mainCategories.map((cat) => (<li onClick={() => {
            const newSearchParams = new URLSearchParams();
            newSearchParams.set("categoryId", cat.id);
            setSearchParams(newSearchParams);
          }} key={cat.id} className='mock' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'var(--categoryCardWidth)', height: 'var(--categoryCardHeight)' }}>
            <img src={cat.picture} style={{ width: 'var(--categoryImgWidth)', height: 'var(--categoryImgHeight)' }}></img>
            {cat.name}
          </li>))}
        </ul>}
      </div>
      <button name='slideForward' onClick={onSlideSlicker}><BsArrowRightCircle /></button>
    </section>
    <h2>{resultsTitle}</h2>
    <section>
      {productLists.map((productList) => <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
        {productList.map((product) => <li key={product.id}>
          <Link to={'/products/product/' + product.id}>
            <div><img src={product.picture[0]} style={{ width: 'var(--productThumbnailWidth)', height: 'var(--productThumbnailHeight)' }}></img></div>
            <div>
              <div>{product.name}</div>
              <div>{product.rating} <BsStar /></div>
              <div>{product.price}$</div>
              <div>{product.soldAmount} sold</div>
            </div>
          </Link>
        </li>)}
      </ul>)}
    </section>
    {/* Hoe Logined
         <div>
       <h1>My App</h1>
       <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
       <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
     </div> */}
  </div>)
  // // The user object has basic properties such as display name, email, etc.
  // const displayName = user.displayName;
  // const email = user.email;
  // const photoURL = user.photoURL;
  // const emailVerified = user.emailVerified;

  // console.log({
  //     displayName: user.displayName,
  //     email: user.email,
  //     photoURL: user.photoURL,
  //     emailVerified: user.emailVerified,

  //   });
  // // The user's ID, unique to the Firebase project. Do NOT use
  // // this value to authenticate with your backend server, if
  // // you have one. Use User.getToken() instead.
  // const uid = user.uid;
  // user.providerData.forEach((profile) => {
  //     console.log("Sign-in provider: " + profile.providerId);
  //     console.log("  Provider-specific UID: " + profile.uid);
  //     console.log("  Name: " + profile.displayName);
  //     console.log("  Email: " + profile.email);
  //     console.log("  Photo URL: " + profile.photoURL);
  //   });
  // }


  return (<div>Home</div>)
}