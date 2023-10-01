import { NavLink } from "react-router-dom";

export default function UserPageNavbar() {
    return (
        <div className="user-page-navbar">
            <NavLink className='navbar-item' to='/user-informations'>
                <i className="fa-solid fa-circle-info" />
                <span>User Informations</span>
            </NavLink>
            <NavLink className='navbar-item' to='/user-informations'>
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
        </div>
    )
}