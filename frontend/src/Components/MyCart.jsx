import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { dynamicTitle } from "../Slices/siteConfigSlice"
import { setConfirmedCart } from "../Slices/authSlice"

export default function MyCart() {
    const { url } = useSelector(state => state.siteConfig)
    const { isLoggedin } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const [products, setProducts] = useState([])
    const [totalPrice, setTotalPrice] = useState('')
    const [shippingCost, setShippingCost] = useState('')
    const [confirmCartMsg, setConfirmCartMsg] = useState([])


    const calculateCartTotalPrice = (array) => {
        let _totalPrice = 0;
        for (let i in array) _totalPrice += array[i].price * array[i].quantity
        setTotalPrice(_totalPrice)

        if (_totalPrice > 149.99 || _totalPrice == 0) setShippingCost(0)
        else setShippingCost(19.99)

    }

    const increaseQuantity = (productId) => {
        let cart = JSON.parse(localStorage.getItem('cart'))
        let productIndex = cart.findIndex(product => product.productId == productId)
        if (productIndex != -1) {
            cart[productIndex].quantity += 1
            calculateCartTotalPrice(cart)
            localStorage.setItem('cart', JSON.stringify(cart))
        }
        setProducts(JSON.parse(localStorage.getItem('cart')))
    }

    const dicreaseQuantity = (productId) => {
        let cart = JSON.parse(localStorage.getItem('cart'))
        let productIndex = cart.findIndex(product => product.productId == productId)
        if (productIndex != -1) {
            if (cart[productIndex].quantity == 1) cart.splice(productIndex, 1)
            else cart[productIndex].quantity -= 1

            calculateCartTotalPrice(cart)
            localStorage.setItem('cart', JSON.stringify(cart))
        }
        setProducts(JSON.parse(localStorage.getItem('cart')))
    }

    const deleteProductFromCart = (productId) => {
        let cart = JSON.parse(localStorage.getItem('cart'))
        cart.splice(cart.findIndex(product => product.productId == productId), 1)
        calculateCartTotalPrice(cart)
        localStorage.setItem('cart', JSON.stringify(cart))
        setProducts(JSON.parse(localStorage.getItem('cart')))
    }

    const confirmCart = async () => {
        if (isLoggedin) {
            let cart = JSON.parse(localStorage.getItem('cart'))
            if (cart != null && cart.length > 0) {
                let _confirmCart = await fetch(url + '/confirm-cart', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json,text/plain',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cart })
                }).then(_res => _res.json())

                if (_confirmCart.result.length == 0) {
                    dispatch(setConfirmedCart(_confirmCart.cart))
                    navigate('/payment')
                }
                else {
                    setConfirmCartMsg(_confirmCart.result)
                    localStorage.setItem('cart', JSON.stringify(_confirmCart.cart))
                }
            }
        }
        else alert('Need login')
    }

    useEffect(() => {
        let cart = JSON.parse(localStorage.getItem('cart'))
        setProducts(cart)
        calculateCartTotalPrice(cart)
        dispatch(dynamicTitle(location.pathname.slice(1)))
    }, [])

    return (
        <div className="my-cart-page container">
            <div className="cart-left-side">
                <div className="cart-header">
                    <h3>My Cart</h3>
                </div>
                <div className="cart-products">
                    {products && products.map((product, index) =>
                        <div key={index} className="product">
                            <div className="image-div" />
                            <div className="product-infos">
                                <NavLink className="title" to={'/product/' + product.title}>{product.title}</NavLink>
                                <span className="price">{product.price}</span>
                            </div>
                            <i onClick={() => deleteProductFromCart()} className="trash-btn fa-regular fa-trash-can" />
                            <div className="buttons">
                                <span onClick={() => increaseQuantity(product.productId)} className="increase-btn">+</span>
                                <span className="quantity">{product.quantity}</span>
                                <span onClick={() => dicreaseQuantity(product.productId)} className="dicrease-btn">-</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="cart-right-side">
                <div className="cart-info">
                    <div className="cart-info-item">
                        <span>Total Price</span>
                        <span>{totalPrice && totalPrice}</span>
                    </div>
                    <div className="cart-info-item">
                        <span>Shipping Cost</span>
                        <span>{shippingCost && shippingCost}</span>
                    </div>
                    <div className="cart-last-price">
                        <span>{totalPrice + shippingCost}</span>
                    </div>
                    {confirmCartMsg &&
                        <div className="confirm-cart-msg-div">
                            {confirmCartMsg.map((msg, index) =>
                                <span key={index}>
                                    {msg.msg}
                                </span>
                            )}
                        </div>
                    }
                    <div className="shipping-info">
                        <i className="fa-solid fa-truck" />
                        <span>Free shipping for over 149.99₺ total cart price</span>
                    </div>
                </div>
                <button onClick={() => confirmCart()} className="confirm-cart-btn blue-btn">Confirm Cart</button>
            </div>
        </div>
    )
}