import UserPageNavbar from "./UserPageNavbar";
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation } from "react-router-dom"
import { dynamicTitle } from "../../Slices/siteConfigSlice"
import { useEffect, useState } from "react";

export default function Reviews() {
    const dispatch = useDispatch()
    const location = useLocation()
    const { user } = useSelector(state => state.auth)
    const { url } = useSelector(state => state.siteConfig)

    const [reviews, setReviews] = useState([])

    const getProductNames = async () => {
        let _reviews = []

        for (let i in user.reviews) {
            let product = await fetch(url + '/get-product-by-id/' + user.reviews[i].productId).then(_res => _res.json())
            if (product.action) {
                _reviews.push({ title: product.product.title, date: user.reviews[i].date, star: user.reviews[i].star, comment: user.reviews[i].comment })
            }
        }

        setReviews(_reviews)
    }

    useEffect(() => {
        dispatch(dynamicTitle(location.pathname.slice(1)))
        if (user) getProductNames()
    }, [location.pathname, user])

    return (
        <div className="reviews-page container">
            <UserPageNavbar />
            <div className="main-section">
                <div className="main-section-header-div">
                    <h3 className="main-section-header">
                        Reviews
                    </h3>
                </div>
                <div className="reviews">
                    {reviews && reviews.map((review, index) =>
                        <div key={index} className="review">
                            <div className="review-header">
                                <div className="title-div">
                                    <span>Title</span>
                                    <NavLink to={'/product/' + review.title}>{review.title}</NavLink>
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
    )
}