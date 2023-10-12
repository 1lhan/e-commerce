import { useEffect, useState } from "react"
import UserPageNavbar from "./UserPageNavbar"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { dynamicTitle } from "../../Slices/siteConfigSlice"

export default function MyOrders() {

    const dispatch = useDispatch()
    const location = useLocation()
    const { user } = useSelector(state => state.auth)
    const { url } = useSelector(state => state.siteConfig)
    const [orders, setOrders] = useState([])

    const getOrders = async () => {
        if (user && user._id) {
            let _orders = await fetch(url + '/get-orders/' + user._id).then(_res => _res.json())
            setOrders(_orders.orders.reverse())
        }
    }

    useEffect(() => {
        dispatch(dynamicTitle(location.pathname.slice(1)))
        getOrders()
    }, [location.pathname, user])

    return (
        <div className="my-orders-page container">
            <UserPageNavbar />
            <div className="main-section">
                <div className="main-section-header-div">
                    <h3 className="main-section-header">My Orders</h3>
                </div>
                <div className="orders">
                    {orders && orders.map((order, index) =>
                        <div key={index} className="order-div">
                            <div className="order-top-div">
                                <div className="status">
                                    <span>Status</span>
                                    <span>{order.status == 1 ? 'active' : 'delivered'}</span>
                                </div><div className="order-date">
                                    <span>Order Date</span>
                                    <span>{new Date(order.date?.orderDate).getDate() + '.' +
                                        (new Date(order.date?.orderDate).getMonth() + 1) + '.' +
                                        new Date(order.date?.orderDate).getFullYear()}
                                    </span>
                                </div>
                                <div className="delivery-date">
                                    <span>Delivery Date</span>
                                    <span>{order?.date?.deliveryDate ?
                                        new Date(order.date.deliveryDate).getDate() + '.' +
                                        (new Date(order.date.deliveryDate).getMonth() + 1) + '.' +
                                        new Date(order.date.deliveryDate).getFullYear()
                                        : ''}</span>
                                </div>
                                <div className="cart-last-price">
                                    <span>Cart Total Price</span>
                                    <span> {order.lastCartPrice}</span>
                                </div>
                            </div>
                            <div className="order-products">
                                {order.cart.map((product, index2) =>
                                    <div key={index2} className="product-div">
                                        <div className="image" />
                                        <div className="product-infos">
                                            <span>{product.title}</span>
                                            <span className="price-span">{product.price + ' x ' + product.quantity + ' = ' + (product.price * product.quantity)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="order-delivery-address">
                                <span>Delivery Address :</span>
                                <span>{order.deliveryAddress.address}</span>
                            </div>
                            <div className="contact-informations">
                                <div>
                                    <span>First Name</span>
                                    <span>{order.contactInformations.firstName}</span>
                                </div>
                                <div>
                                    <span>First Name</span>
                                    <span>{order.contactInformations.lastName}</span>
                                </div>
                                <div>
                                    <span>First Name</span>
                                    <span>{order.contactInformations.telephone}</span>
                                </div>
                            </div>
                            <div className="card-infos">
                                <span>Card Number :</span>
                                <span>{order.cardInformations.cardNumber.slice(0, 4) + ' **** **** ' + order.cardInformations.cardNumber.slice(-4)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}