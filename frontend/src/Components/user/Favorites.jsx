import { useDispatch, useSelector } from "react-redux"
import UserPageNavbar from "./UserPageNavbar"
import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { updateUser } from "../../Slices/authSlice"
import { dynamicTitle } from "../../Slices/siteConfigSlice"

export default function Favorites() {

    const { url } = useSelector(state => state.siteConfig)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const location = useLocation()

    const [favoriteProducts, setFavoriteProducts] = useState([])

    const getProductNames = async () => {
        let _getProductNames = await fetch(url + '/get-product-infos-by-id', {
            method: 'POST',
            headers: {
                'Accept': 'application/json,text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ products: user.favorites })
        }).then(_res => _res.json())
        setFavoriteProducts(_getProductNames.products)
    }

    const favoriteHandle = async (productId) => {
        let _favoriteHandle = await fetch(url + '/favorites', {
            method: 'POST',
            headers: {
                'Accept': 'application/json,text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user._id, productId })
        }).then(_res => _res.json())

        if (_favoriteHandle.action) dispatch(updateUser(_favoriteHandle.user))
    }

    useEffect(() => {
        if (user && user.favorites) getProductNames()
        dispatch(dynamicTitle(location.pathname.slice(1)))
    }, [user, location])

    return (
        <div className="favorites-page container">
            <UserPageNavbar />
            <div className="main-section">
                <div className="main-section-header-div">
                    <h3 className="main-section-header">Favorites</h3>
                </div>
                <div className="favorite-products">
                    {favoriteProducts && favoriteProducts.map((product, index) =>
                        <div key={index} className="favorite-product">
                            <span className="img"></span>
                            <div>
                                <NavLink className='title' to={'/product/' + product.title}>{product.title}</NavLink>
                                <span className="price-span">{product.price}</span>
                            </div>

                            <i
                                onClick={() => favoriteHandle(product.productId)}
                                className="fa-regular fa-heart" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}