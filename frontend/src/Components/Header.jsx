import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { login, logout } from "../Slices/authSlice"

export default function Header() {

    const { url, categories } = useSelector(state => state.siteConfig)
    const { user, isLoggedin } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const autoLogin = () => {
        fetch(url + '/auto-login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: document.cookie })
        })
            .then(_res => _res.json())
            .then(res => {
                if (res.bool) {
                    dispatch(login(res.user))
                }
            })
            .catch(err => console.log(err))
    }

    const logoutHandle = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        dispatch(logout())
        navigate('/')
    }

    useEffect(() => {
        autoLogin()
    }, [])

    return (
        <header>
            <div className="header-div container">
                <div className="header-top-div">
                    <NavLink to='/' className="header-site-name-btn">E Commerce Site</NavLink>
                    <div className="header-btn-div-1">
                        {isLoggedin ?
                            <span className="user-span">
                                <i className="fa-regular fa-user" />
                                {user && user.firstName}
                            </span>
                            :
                            <NavLink to='/login' className="header-login-btn">
                                <i className="fa-regular fa-user" />
                                <span>{isLoggedin ? user.firstName : 'Login'}</span>
                            </NavLink>
                        }
                        <div style={{ padding: isLoggedin ? '' : '0' }} className="dropdown">
                            {user && user.accountType == 'admin' ?
                                <>
                                    <NavLink to='/admin/add-product'>
                                        <i className="fa-regular fa-square-plus" />
                                        <span>Add Product</span>
                                    </NavLink>
                                    <NavLink to='/admin/products'>
                                        <i className="fa-brands fa-product-hunt" />
                                        <span>Products</span>
                                    </NavLink>
                                    <button onClick={() => logoutHandle()} className="header-dropdown-logout-btn">
                                        <i className="fa-solid fa-arrow-right-from-bracket" />
                                        <span>Logout</span>
                                    </button>
                                </>
                                : ''}
                            {user && user.accountType == 'user' ?
                                <>
                                    <NavLink to='/user-informations'>
                                        <i className="fa-solid fa-circle-info" />
                                        <span>User Informations</span>
                                    </NavLink>
                                    <NavLink to='/my-orders'>
                                        <i className="fa-solid fa-box" />
                                        <span>My Orders</span>
                                    </NavLink>
                                    <NavLink className='navbar-item' to='/addresses'>
                                        <i className="fa-solid fa-location-dot" />
                                        <span>Addresses</span>
                                    </NavLink>
                                    <NavLink className='navbar-item' to='/favorites'>
                                        <i className="fa-regular fa-heart" />
                                        <span>Favorites</span>
                                    </NavLink>
                                    <NavLink className='navbar-item' to='/reviews'>
                                        <i className="fa-regular fa-message" />
                                        <span>Reviews</span>
                                    </NavLink>
                                    <button onClick={() => logoutHandle()} className="header-dropdown-logout-btn">
                                        <i className="fa-solid fa-arrow-right-from-bracket" />
                                        <span>Logout</span>
                                    </button>
                                </> : ''}
                        </div>
                    </div>
                </div>
                <ul className="categories">
                    {categories && Object.keys(categories).map((category, index) =>
                        <li key={index} className="category-item">
                            {category}
                            <div className="category-item-dropdown">
                                {categories[category].map((subCategory, index2) =>
                                    <NavLink className="category-item-dropdown-item" to={'/category/' + subCategory} key={index2}>
                                        {subCategory.includes('-') ? subCategory.replace('-', ' ') : subCategory}
                                    </NavLink>
                                )}
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </header>
    )
}