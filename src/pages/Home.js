import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import HomeHeader from '../components/HomeHeader';
import { BsCaretRightFill, BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import { useCallback } from 'react';
import categoryService from '../services/categoryService'
import { constant } from '../config';
import { useOutletContext } from "react-router-dom";
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
  
  useEffect(() => {
    const initialGeneralSearchInput = searchParams.get('generalSearchInput')
    const initialPage = searchParams.get('page')
    if (initialGeneralSearchInput || initialGeneralSearchInput == '' || searchParams.size == 0) {
      const filter = {
        $or: [
          { name: { $regex: initialGeneralSearchInput, $options: 'i' } },
          { 'categories.name': { $regex: initialGeneralSearchInput, $options: 'i' } },
          { description: { $regex: initialGeneralSearchInput, $options: 'i' } },
        ]
      }
      const options = { page: initialPage }
      productService.getProducts(filter, options).then(({ data }) => {
        console.log(data);
        setRes(data.results)
        setPagiProps((pagiProps) => ({
          ...pagiProps,
          count: data.totalPages,
          page: data.page
        }))
      })
    } else {
      const filter = {
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

      const options = { sortBy: searchParams.get('sortField') + ':' + searchParams.get('sortOrder'), page: initialPage }
      productService.getProducts(filter, options).then(({ data }) => {
        console.log(data);
        setRes(data.results)
        setPagiProps((pagiProps) => ({
          ...pagiProps,
          count: data.totalPages,
          page: data.page
        }))
      })
    }
    //TODO: implement search on category
  }, [searchParams])
  const onGeneralSearchSubmit = useCallback(async (e) => {
    e.preventDefault()
    const queryString = qs.stringify({ generalSearchInput }, { encode: false })
    navigate('/products?' + queryString)
  }, [generalSearchInput])
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
  const [mainCategories, setMainCategories] = useState()
  useEffect(() => {
    categoryService.getChildrenCategory(categoryService.rootCategoryId).then(({ data }) => {
      console.log(data);
      setMainCategories(data)
    })
  }, [])
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
  const [slickerStyle, setSlickerStyle] = useState({ translate: 0, transitionValue: 0 })
  const onSlideSlicker = function (e) {
    console.log(e.target.name);
    const newSlickerStyle = { ...slickerStyle }
    if (e.target.name == 'slideForward') {
      newSlickerStyle.transitionValue -= constant.css.categoryCardWidth.value
    } else {
      newSlickerStyle.transitionValue += constant.css.categoryCardWidth.value
    }
    newSlickerStyle.translate = newSlickerStyle.transitionValue + constant.css.categoryCardWidth.unit
    setSlickerStyle(newSlickerStyle)
  }
  return (<div>
    <HomeHeader onSearchSubmit={onGeneralSearchSubmit}/>
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
          {mainCategories.map((cat) => (<li key={cat.id} className='mock' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: constant.css.categoryCardWidth.string, height: constant.css.categoryCardHeight.string }}>
            <img src={cat.picture} width={constant.css.categoryImgWidth.string} height={constant.css.categoryImgHeight.string}></img>
            {cat.name}
          </li>))}
        </ul>}
      </div>
      <button name='slideForward' onClick={onSlideSlicker}><BsArrowRightCircle /></button>
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