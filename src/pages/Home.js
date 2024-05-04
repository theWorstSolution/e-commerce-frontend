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
import Select from 'react-select';
import { Pagination } from '@mui/material';
import userService from '../services/userService';
const qs = require('qs')

export default function Home() {
  const { user } = useContext(globalContext);
  const [categoriesAtLevel, setCategoriesAtLevel] = useState([[{ id: categoryService.rootCategoryId, name: 'root' }]])  // có id, name
  const [catsSelected, setCatsSelected] = useState([{ value: categoryService.rootCategoryId, label: 'root' }])    // có value và label

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
      setCategoriesAtLevel((categoriesAtLevel) => {
        return [...categoriesAtLevel, data]
      })
    })
  }, [])

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
      setResultsTitle('Search results:')
    } else if (searchParams.get('recommended-products')) {
      options = { page: initialPage }
      userService.getRecommendedProducts(options).then(({ data }) => {
        console.log(data);
        setRes(data.results)
        setPagiProps((pagiProps) => ({
          ...pagiProps,
          count: data.totalPages,
          page: data.page
        }))
      })
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
      if (searchParams.get('maxPrice') != '' && searchParams.get('maxPrice')) {
        filter.price.$lte = searchParams.get('maxPrice')
      }
      if (searchParams.get('minSoldAmount') != '' && searchParams.get('minSoldAmount')) {
        filter.soldAmount.$gte = searchParams.get('minSoldAmount')
      }
      if (searchParams.get('maxSoldAmount') != '' && searchParams.get('maxSoldAmount')) {
        filter.soldAmount.$lte = searchParams.get('maxSoldAmount')
      }
      filter['categories.id'] = searchParams.get('categoryId')

      options = { sortBy: searchParams.get('sortField') + ':' + searchParams.get('sortOrder'), page: initialPage }
      setResultsTitle('Search results:')
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
  }, [])

  const [detailSearchInput, setDetailSearchInput] = useState({ sortField: 'name', sortOrder: 'asc' })
  const onDetailSearchInputChange = useCallback((event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDetailSearchInput(values => ({ ...values, [name]: value }))
  }, [])
  const onDetailSearchSubmit = useCallback((e) => {
    e.preventDefault()
    const newSearchParams = new URLSearchParams();
    for (let param in detailSearchInput) {
      newSearchParams.set(param, detailSearchInput[param]);
    }
    newSearchParams.set('categoryId', catsSelected[catsSelected.length - 1].value)
    setSearchParams(newSearchParams);
    // const queryString = qs.stringify(detailSearchInput, { encode:false})
    // navigate('/products?'+queryString)
  }, [detailSearchInput, catsSelected])



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
      newAccordionState.contentStyle = { maxHeight: '300px' }
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
  const maxProductsPerRow = 5
  useEffect(() => {
    if (res) {
      const newProductLists = []
      for (let i = 0; i < res.length; i++) {
        if (!newProductLists[Math.floor(i / maxProductsPerRow)]) {
          newProductLists[Math.floor(i / maxProductsPerRow)] = []
        }
        newProductLists[Math.floor(i / maxProductsPerRow)].push(res[i])
      }
      setProductLists(newProductLists)
    }
  }, [res])


  return (<div>
    <HomeHeader navigateLinkOnSearch='/products?' />

    <h2 onClick={onClickAccordion} style={{ display: 'flex', alignItems: 'center' }}><BsCaretRightFill style={{ transition: 'transform 1s ease-in-out', ...accordionState.arrowStyle }} />Detail search</h2>
    <form onSubmit={onDetailSearchSubmit} style={{ transition: 'max-height 1s ease-in-out', border: 'solid', overflow: 'auto', ...accordionState.contentStyle }}>
      <label>Name/description/category:</label>
      <input type='search' name='name_description_category' onChange={onDetailSearchInputChange} />
      <p>
        <label>Price</label>
        <input type='number' name="minPrice" onChange={onDetailSearchInputChange} />
        <input type='number' name="maxPrice" onChange={onDetailSearchInputChange} />
      </p>
      <p>
        <label>Sold amount</label>
        <input type='number' name="minSoldAmount" onChange={onDetailSearchInputChange} />
        <input type='number' name="maxSoldAmount" onChange={onDetailSearchInputChange} />
      </p>
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

              const { data: childrenCats } = await categoryService.getChildrenCategory(newSelected.value)
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
      <p>
        <label>Sort by</label>
        <select value={detailSearchInput.sortField} name="sortField" onChange={onDetailSearchInputChange}>
          <option value='name' >Name</option>
          <option value='price' >Price</option>
          <option value='soldAmount' >Sold amount</option>
        </select>
      </p>
      <div>
        <input type="radio" onChange={onDetailSearchInputChange} name="sortOrder" value="asc" defaultChecked={detailSearchInput.sortOrder == 'asc'} /><label>Ascending </label>
        <input type="radio" onChange={onDetailSearchInputChange} name="sortOrder" value="desc" defaultChecked={detailSearchInput.sortOrder == 'desc'} /><label>Descending </label>
      </div>
      <button type='submit'>Submit</button>
    </form>


    <h2>Categories</h2>
    <section style={{ display: 'flex' }}>
      <button name='slideBack' onClick={onSlideSlicker}><BsArrowLeftCircle /></button>
      <div style={{ overflow: 'hidden' }}>
        {mainCategories && <ul className='horizontalUl' style={{ listStyleType: 'none', transition: 'translate 1s ease-in-out', ...slickerStyle }}>
          <li onClick={async () => {
            await userService.genRecommendedProducts()
            const newSearchParams = new URLSearchParams();
            newSearchParams.set("recommended-products", true);
            setSearchParams(newSearchParams);
          }}>Recommended Products</li>
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
        {productList.map((product) => <li key={product.id} style={{ width: '200px' }}>
          <Link to={'/products/product/' + product.id}>
            <div><img src={product.pictures[0]} style={{ width: 'var(--productThumbnailWidth)', height: 'var(--productThumbnailHeight)' }}></img></div>
            <div>
              <div>{product.name}</div>
              <div>{product.rating} <BsStar /></div>
              <div>{product.price}$</div>
              <div>{product.soldAmount} sold</div>
            </div>
          </Link>
        </li>)}
      </ul>)}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination {...pagiProps} onChange={onChangePage} style={{ marginRight: '5px' }} /></div>
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