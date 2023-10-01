import { useDispatch, useSelector } from "react-redux"
import UserPageNavbar from "./UserPageNavbar"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { updateUser } from "../../Slices/authSlice"

export default function Favorites() {

    const { url } = useSelector(state => state.siteConfig)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [favoriteProducts, setFavoriteProducts] = useState([])

    const getProductNames = async () => {
        let _getProductNames = await fetch(url + '/get-product-names', {
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

        if (_favoriteHandle.action)  dispatch(updateUser(_favoriteHandle.user))
    }

    useEffect(() => {
        if (user && user.favorites) getProductNames()
    }, [user])

    return (
        <div className="favorites-page container">
            <UserPageNavbar />
            <div className="main-section">
                <h3 className="main-section-header">Favorites</h3>
                <div className="favorite-products">
                    {favoriteProducts && favoriteProducts.map((product, index) =>
                        <div key={index} className="favorite-product">
                            <span className="img"></span>
                            <NavLink className='title' to={'/product/' + product.title}>{product.title}</NavLink>
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