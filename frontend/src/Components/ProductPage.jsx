import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { updateUser } from "../Slices/authSlice"

export default function ProductPage() {

    const { productName } = useParams()
    const { url } = useSelector(state => state.siteConfig)
    const { user, isLoggedin } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [product, setProduct] = useState({})
    const [starArray, setStarArray] = useState([])
    const [navSectionName, setNavSectionName] = useState('product-informations')
    const [reviews, setReviews] = useState([])

    const [choosedStar, setChoosedStar] = useState(-1)
    const [comment, setComment] = useState('')

    const getProduct = async () => {
        let product = await fetch(url + '/get-product/' + productName).then(_res => _res.json())

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
        getUserNames(product.product)
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

        if (_favoriteHandle.action) dispatch(updateUser(_favoriteHandle.user))
        else console.log(false)
    }

    const addToCart = (productId) => {
        let cartObj = JSON.parse(localStorage.getItem('cart'))
        if (cartObj == null) localStorage.setItem('cart', JSON.stringify([{ productId, image: product.image, title: product.title, price: product.price, quantity: 1 }]))
        else {
            if (cartObj.findIndex(product => product.productId == productId) == -1) {
                cartObj.push({ productId, image: product.image, title: product.title, price: product.price, quantity: 1 })
                localStorage.setItem('cart', JSON.stringify(cartObj))
            }
        }
    }

    const dynamicStarColoring = (e) => {
        let parentNode = e.target.parentNode.children
        let hoveredStarIndex = e.target.id.slice(-1)
        for (let i = 0; i < parentNode.length; i++) {
            parentNode[i].style.color = ''
        }
        for (let i = 0; i < hoveredStarIndex; i++) {
            parentNode[i].style.color = 'yellow'
        }
    }

    const removeStarsColor = (e) => {
        if (choosedStar == -1) {
            let parentNode = e.target.parentNode.children
            for (let i = 0; i < parentNode.length; i++) {
                parentNode[i].style.color = ''
            }
        }
    }

    const addReview = async (e) => {
        e.preventDefault()

        if (choosedStar < 1) alert('Choosed star can not be 0')
        else {
            let _addReview = await fetch(url + '/add-review', {
                method: 'POST', headers: {
                    'Accept': 'application/json,text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: user._id, productId: product._id, star: choosedStar, comment })
            }).then(_res => _res.json())

            if (_addReview.action) {
                alert('Review added')
                document.getElementById('add-review-form').style.display == 'none'
            }
            else alert(_addReview.msg)
        }
    }

    const getUserNames = async (product) => {
        let _reviews = []
        for (let i in product.reviews.reviewsArray) {
            let _user = await fetch(url + '/get-user/' + product.reviews.reviewsArray[i].userId).then(_res => _res.json())

            if (_user.action) {
                _reviews.push({ username: _user.user.firstName, date: product.reviews.reviewsArray[i].date, star: product.reviews.reviewsArray[i].star, comment: product.reviews.reviewsArray[i].comment })
            }
        }
        setReviews(_reviews)
    }

    useEffect(() => {
        getProduct()
    }, [user])

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
                                        <i style={{ color: product.reviews.averageStar > index ? 'yellow' : 'none' }} key={index} className="fa-solid fa-star" />
                                    )}
                                </span>
                                {product && product.reviews && <span>{'(' + product.reviews.averageStar + ')'}</span>}
                                <span className="reviews-number">
                                    <span>{product?.reviews?.reviewsArray.length}</span>
                                    <span> reviews</span>
                                </span>
                            </div>
                            <div className="buttons-div">
                                <button
                                    disabled={product.stock > 0 ? false : true}
                                    style={{
                                        background: localStorage.getItem('cart') == null ?
                                            '' : JSON.parse(localStorage.getItem('cart')).findIndex(item => item.productId == product._id) != -1 ? '#22c55e' : ''
                                    }}
                                    onClick={(e) => { e.target.style.background = '#22c55e'; addToCart(product._id) }} className="blue-btn">
                                    {product.stock > 0 ? 'Add To Cart' : 'Out of stock'}
                                </button>
                                {user &&
                                    <i onClick={() => favoriteHandle()}
                                        style={{ display: isLoggedin ? 'flex' : 'none', color: user.favorites?.findIndex(item => item.productId == product._id) == -1 ? '' : '#22c55e' }}
                                        className="add-to-favorites-btn fa-regular fa-heart" />
                                }
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
                        <div style={{ display: navSectionName == 'reviews' ? 'flex' : 'none' }} className="reviews-section">
                            <form style={{ display: isLoggedin ? '' : 'none' }} id="add-review-form" onSubmit={addReview} className="add-review-form">
                                <div className="header">
                                    <i className="fa-regular fa-message" />
                                    <h4>Add Review</h4>
                                </div>
                                <div className="body">
                                    <div className="stars-div">
                                        {[...Array(5)].map((star, index) =>
                                            <i key={index}
                                                onClick={(e) => {
                                                    dynamicStarColoring(e)
                                                    setChoosedStar(index + 1)
                                                }}
                                                id={'star-' + (index + 1)} className="fa-solid fa-star"
                                                onMouseOut={(e) => removeStarsColor(e)}
                                                onMouseOver={(e) => dynamicStarColoring(e)} />
                                        )}
                                    </div>
                                    <div className="comment">
                                        <textarea onChange={(e) => setComment(e.target.value)} />
                                    </div>
                                    <button type="submit" className="blue-btn add-review-btn">
                                        Add review
                                    </button>
                                </div>
                            </form>
                            <div className="reviews">
                                {reviews && reviews.map((review, index) =>
                                    <div key={index} className="review">
                                        <div className="review-header">
                                            <div className="title-div">
                                                <span>User</span>
                                                <span>{review.username}</span>
                                            </div>
                                            <div>
                                                <span>Date</span>
                                                <span>{new Date(review.date).getDate() + '.' + (new Date(review.date).getMonth() + 1) + '.' + new Date(review.date).getFullYear()}</span>
                                            </div>
                                        </div>
                                        <div className="review-body">
                                            <div className="stars-div">
                                                {[...Array(5)].map((star, index) =>
                                                    <i style={{ color: review.star > index ? 'yellow' : '' }} key={index} className="fa-solid fa-star" />
                                                )}
                                            </div>
                                            <input style={{ display: review.comment.length == 0 ? 'none' : '' }} className="comment" disabled type="text" defaultValue={review.comment} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}