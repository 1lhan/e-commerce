import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useParams, useSearchParams } from 'react-router-dom';
import PageCouldntFind from './PageCouldntFind';
import { dynamicTitle } from '../Slices/siteConfigSlice';

export default function ProductsByCategory() {

    const { featuresByCategory, url } = useSelector(state => state.siteConfig)
    const { categoryName } = useParams()
    const dispatch = useDispatch()
    const location = useLocation()
    let [searchParams, setSearchParams] = useSearchParams()

    const [products, setProducts] = useState([])
    const [productAttributes, setProductAttributes] = useState({})
    const [isCategoryExist, setIsCategoryExist] = useState(false)
    const [sortName, setSortName] = useState('recomended-sort')

    const getProducts = async () => {
        let pathname = location.search.length == 0 ? location.search.slice(1) + 'category=' + categoryName : location.search.slice(1) + '&category=' + categoryName;
        let _getProducts = await fetch(url + '/get-products/' + pathname).then(_res => _res.json())

        if (sortName == 'recomended-sort') setProducts(_getProducts.sort((a, b) => new Date(a.date) - new Date(b.date)))
        else if (sortName == 'newest') setProducts(_getProducts.sort((a, b) => new Date(b.date) - new Date(a.date)))
        else if (sortName == 'highest-price') setProducts(_getProducts.sort((a, b) => b.price - a.price))
        else if (sortName == 'lowest-price') setProducts(_getProducts.sort((a, b) => a.price - b.price))
        else if (sortName == 'most-selled') setProducts(_getProducts.sort((a, b) => b.saleAmount - a.saleAmount))
        else if (sortName == 'review') setProducts(_getProducts.sort((a, b) => b.reviews.averageStar - a.reviews.averageStar))
    }

    const sortHandle = (_sortname) => {
        if (_sortname == 'recomended-sort') setProducts(products.sort((a, b) => new Date(a.date) - new Date(b.date)))
        else if (_sortname == 'newest') setProducts(products.sort((a, b) => new Date(b.date) - new Date(a.date)))
        else if (_sortname == 'highest-price') setProducts(products.sort((a, b) => b.price - a.price))
        else if (_sortname == 'lowest-price') setProducts(products.sort((a, b) => a.price - b.price))
        else if (_sortname == 'most-selled') setProducts(products.sort((a, b) => b.saleAmount - a.saleAmount))
        else if (_sortname == 'review') setProducts(products.sort((a, b) => b.reviews.averageStar - a.reviews.averageStar))
    }

    const filterHandle = (name, value) => {
        if (searchParams.has(name)) {
            let _oldValue = searchParams.get(name)
            searchParams.delete(name)

            if (_oldValue.includes(value)) {
                if (_oldValue.slice(0).split(',').length == 1) searchParams.delete(name)
                else searchParams.append(name, _oldValue.includes(',' + value) ? _oldValue.replace(',' + value, '') : _oldValue.replace(value + ',', ''))
            }
            else searchParams.append(name, _oldValue + ',' + value)
        }
        else searchParams.append(name, value)
        setSearchParams(searchParams)
    }

    useEffect(() => {
        dispatch(dynamicTitle(categoryName))
        for (let i in Object.keys(featuresByCategory)) {
            if (Object.keys(featuresByCategory)[i] == categoryName) {
                setProductAttributes(featuresByCategory[Object.keys(featuresByCategory)[i]])
                setIsCategoryExist(true)
                break;
            }
        }
        getProducts()
    }, [categoryName, location.search])

    return (
        <>{isCategoryExist ?

            <div className="products-by-category-page container">
                <div className='filters'>
                    {productAttributes && Object.keys(productAttributes).map((attributeName, index) =>
                        <div key={index} className='filter-div'>
                            <input defaultChecked={index > 3 ? false : true} className='filter-labels-display-controller' id={attributeName} type='checkbox' />
                            <label htmlFor={attributeName} className='filter-div-header'>
                                {attributeName}
                                <i className="fa-solid fa-caret-up" />
                                <i className="fa-solid fa-caret-down" />
                            </label>
                            <div className='filter-labels'>
                                {productAttributes[attributeName].map((attributeValue, index2) =>
                                    <label htmlFor={attributeName + attributeValue} key={index2} className='filter-label'>
                                        <span>{attributeValue.includes('_') ? attributeValue.split('_').join(' ') : attributeValue}</span>
                                        <input defaultChecked={searchParams.get(attributeName) != null ? searchParams.get(attributeName).includes(attributeValue) ? true : false : false} onClick={() => filterHandle(attributeName, attributeValue)} id={attributeName + attributeValue} type='checkbox'></input>
                                    </label>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className='content-div'>
                    <div className='content-top-div'>
                        <div className='custom-sorter-select-div'>
                            <button className='custom-sorter-select-btn'>
                                <span>{sortName.includes('-') ? sortName.replace('-', ' ') : sortName}</span>
                                <i className="fa-solid fa-sort" />
                            </button>
                            <div className='dropdown'>
                                <span onClick={() => { setSortName('recomended-sort'); sortHandle('recomended-sort') }}>Recomended Sort</span>
                                <span onClick={() => { setSortName('newest'); sortHandle('newest') }}>Newest</span>
                                <span onClick={() => { setSortName('highest-price'); sortHandle('highest-price') }}>Highest Price</span>
                                <span onClick={() => { setSortName('lowest-price'); sortHandle('lowest-price') }}>Lowest Price</span>
                                <span onClick={() => { setSortName('most-selled'); sortHandle('most-selled') }}>Most Selled</span>
                                <span onClick={() => { setSortName('review'); sortHandle('review') }}>Review</span>
                            </div>
                        </div>
                    </div>
                    <div className='products'>
                        {products && products.map((product, index) =>
                            <div key={index} className='product'>
                                <div className='image-div'>
                                    <NavLink>
                                        <img />
                                    </NavLink>
                                </div>
                                <div className='product-informations'>
                                    <NavLink to={'/product/' + product.title} className="title">{product.title}</NavLink>
                                    <div className='stars'>{[...Array(5)].map((star, index2) =>
                                        <i style={{ color: product.reviews.averageStar > index2 ? 'yellow' : '#d1d5db' }} key={index2} className="fa-solid fa-star" />
                                    )}
                                        <span className='number-of-reviews'>{'(' + product.reviews.reviewsArray.length + ')'}</span>
                                    </div>
                                    <span className='price'>{product.price.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            : <PageCouldntFind />}</>
    )
}