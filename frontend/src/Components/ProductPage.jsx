import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { updateUser } from "../Slices/authSlice"

export default function ProductPage() {

    const { productName } = useParams()
    const { url } = useSelector(state => state.siteConfig)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [product, setProduct] = useState({})
    const [starArray, setStarArray] = useState([])
    const [navSectionName, setNavSectionName] = useState('product-informations')

    const getProduct = async () => {
        let product = await fetch(url + '/get-product/' + productName).then(_res => _res.json())
        console.log(product)

        let star = product.product.reviews.averageStar
        let _starArray = []
        for (let i = 1; i <= 5; i++) {
            if (star - 1 < 1) {
                _starArray.push(Number((star % 1).toFixed(2)))
                star = 0
            }
            else if (star == 0) _starArray.push(0)
            else {
                star = star - 1
                _starArray.push(1)
            }
        }
        setStarArray(_starArray)
        setProduct(product.product)
        //background: -webkit-linear-gradient(left, #00ff00 50%, #fff 50%)
    }

    const favoriteHandle = async () => {
        let _favoriteHandle = await fetch(url + '/favorites', {
            method: 'POST',
            headers: {
                'Accept': 'application/json,text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user._id, productId: product._id })
        }).then(_res => _res.json())

        if (_favoriteHandle.action) {
            console.log(true)
            dispatch(updateUser(_favoriteHandle.user))
        }
        else console.log(false)
    }

    useEffect(() => {
        getProduct()
    }, [])

    return (
        <div className="product-page container">
            {product &&
                <>
                    <div className="product">
                        <div className="image-div">
                        </div>
                        <div className="product-infos">
                            <h3 className="title">{product.title}</h3>
                            <span className="price">{product.price}</span>
                            <div className="review-info-div">
                                <span className="stars">
                                    {starArray && starArray.map((star, index) =>
                                        <i key={index} className="fa-regular fa-star" />
                                    )}
                                </span>
                                {product && product.reviews && <span>{'(' + product.reviews.averageStar + ')'}</span>}
                                <span className="reviews-number">
                                    <span>{product?.reviews?.averageStar}</span>
                                    <span> reviews</span>
                                </span>
                            </div>
                            <div className="buttons-div">
                                <button className="blue-btn">Add To Cart</button>
                                <i onClick={() => favoriteHandle()} style={{ color: user?.favorites?.findIndex(item => item.productId == product._id) == -1 ? '' : '#22c55e' }} className="add-to-favorites-btn fa-regular fa-heart" />
                            </div>
                            <div className="main-features">
                                <span className="main-features-header">Main Features</span>
                                {product && product.features && Object.keys(product.features).slice(0, 6).map((item, index) =>
                                    <span className="main-feature-item" key={index}>
                                        <span>{item.includes('-') ? item.replace('-', ' ') : item}</span>
                                        <span>{Object.values(product.features)[index].includes('_') ? Object.values(product.features)[index].replace('_', ' ') : Object.values(product.features)[index]}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="product-page-second-section">
                        <div className="nav">
                            <span style={{ background: navSectionName == 'product-informations' ? '#d1d5db' : '' }} onClick={() => setNavSectionName('product-informations')} className="nav-item">Product Informations</span>
                            <span style={{ background: navSectionName == 'reviews' ? '#d1d5db' : '' }} onClick={() => setNavSectionName('reviews')} className="nav-item">Reviews</span>
                        </div>
                        <div style={{ display: navSectionName == 'product-informations' ? 'flex' : 'none' }} className="product-informations-section">
                            <div className="features">
                                {product && product.features && Object.keys(product.features).slice(0, 6).map((item, index) =>
                                    <span className="feature-span" key={index}>
                                        <span>{item.includes('-') ? item.replace('-', ' ') : item}</span>
                                        <span>{Object.values(product.features)[index].includes('_') ? Object.values(product.features)[index].replace('_', ' ') : Object.values(product.features)[index]}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}