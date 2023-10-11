import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function Orders() {
    const { url } = useSelector(state => state.siteConfig)

    const [orders, setOrders] = useState([])
    const [infoDivText, setInfoDivText] = useState('')

    const getOrders = async (status) => {
        let _orders = await fetch(url + '/get-orders').then(_res => _res.json())
        if (status != -1) _orders = _orders.filter(item => item.status == status)
        setOrders(_orders.reverse())
    }

    const updateOrderStatus = async (orderId, status) => {
        let update = await fetch(url + '/update-order-status', {
            method: 'POST',
            headers: {
                'Accept': 'application/json,text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId, status })
        }).then(_res => _res.json())

        if (update.action) setInfoDivText('Order status updated')
    }

    useEffect(() => {
        getOrders(-1)
    }, [])

    return (
        <div className="admin-orders-page container">
            {infoDivText && <div className="info-div">
                <span>{infoDivText}</span>
                <i onClick={() => setInfoDivText('')} className="fa-solid fa-xmark" />
            </div>}
            <div className="filters-div">
                <select onChange={(e) => getOrders(e.target.value)} className="custom-select">
                    <option value={-1}>Status</option>
                    <option value={1}>Active</option>
                    <option value={2}>Delivered</option>
                    <option value={3}>Canceled</option>
                </select>
            </div>
            <div className="orders">
                {orders && orders.map((order, index) =>
                    <div key={index} className="order-div">
                        <div className="order-top-div">
                            <div className="status">
                                <span>Status</span>
                                <span>{order.status == 1 ? 'active' : 'delivered'}</span>
                            </div>
                            <div className="order-date">
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
                            <select defaultValue={order.status} className="custom-select" onChange={(e) => updateOrderStatus(order._id, e.target.value)}>
                                <option value={1}>Active</option>
                                <option value={2}>Delivered</option>
                                <option value={3}>Canceled</option>
                            </select>
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
    )
}