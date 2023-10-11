import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setConfirmedCart } from "../Slices/authSlice"

export default function PaymentPage() {

    const { user, confirmedCart } = useSelector(state => state.auth)
    const { url } = useSelector(state => state.siteConfig)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [deliveryAddress, setDeliveryAddress] = useState()
    const [choosedContantInformations, setChoosedContantInformations] = useState('default')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [telephone, setTelephone] = useState('')
    const [cardNumber1, setCardNumber1] = useState('')
    const [cardNumber2, setCardNumber2] = useState('')
    const [cardNumber3, setCardNumber3] = useState('')
    const [cardNumber4, setCardNumber4] = useState('')
    const [expirationDateMonth, setExpirationDateMonth] = useState('')
    const [expirationDateYear, setExpirationDateYear] = useState('')
    const [cvv, setCvv] = useState('')
    const [nameOnCard, setNameOnCard] = useState('')
    const [shoppingMsg, setShoppingMsg] = useState('')

    const [totalPrice, setTotalPrice] = useState('')
    const [shippingCost, setShippingCost] = useState('')

    const calculateCartTotalPrice = (array) => {
        let _totalPrice = 0;
        for (let i in array) _totalPrice += array[i].price * array[i].quantity
        setTotalPrice(_totalPrice)

        if (_totalPrice > 149.99 || _totalPrice == 0) setShippingCost(0)
        else setShippingCost(19.99)

    }

    const dynamicInputHandle = (e, index) => {
        if (e.target.value.length == 4 && index != 4) e.target.nextSibling.focus()
        else if (e.target.value.length == 5 && index == 4) e.target.value = e.target.value.slice(0, 4)
        else if (e.target.value.length == 0 && index != 1) e.target.previousSibling.focus()
    }

    const completeShopping = async () => {
        if (!deliveryAddress) setShoppingMsg('Missing delivery address')
        else if (choosedContantInformations != 'default' && firstName.length < 1 || lastName.length < 1 || telephone.length == 0) {
            setShoppingMsg('Missing contact informations')
        }
        else if (choosedContantInformations == 'default' && user.firstName.length < 1 || user.lastName.length < 1 || user.userInformations.telephone.length <= 9) {
            setShoppingMsg('Missing contact informations')
        }
        else if (cardNumber1.length != 4 || cardNumber2.length != 4 || cardNumber3.length != 4 || cardNumber4.length != 4 ||
            expirationDateMonth.length != 2 || expirationDateYear.length != 2 || cvv.length != 3 || nameOnCard.length < 4) {
            setShoppingMsg('Missing card informations')
        }
        else {
            setShoppingMsg('')
            let contactInformations = choosedContantInformations == 'default' ? { firstName: user.firstName, lastName: user.lastName, telephone: user.userInformations.telephone } : { firstName, lastName, telephone }

            let _completeShopping = await fetch(url + '/complate-shopping', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json,text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user._id, deliveryAddress, contactInformations,
                    cardInformations: { cardNumber: cardNumber1 + cardNumber2 + cardNumber3 + cardNumber4, expirationDate: expirationDateMonth + '/' + expirationDateYear, cvv, nameOnCard },
                    totalPrice: Number(totalPrice), shippingCost: Number(shippingCost), lastCartPrice: Number(totalPrice) + Number(shippingCost), cart: confirmedCart
                })
            }).then(_res => _res.json())

            if (_completeShopping.action) {
                navigate('/my-orders')
                alert('Your order has been taken')
                localStorage.removeItem('cart')
                dispatch(setConfirmedCart([]))
            }
        }
    }

    const dynamicInputForExpirationDateInput = (e, index) => {
        if (e.target.value.length == 2 && index != 2) e.target.nextSibling.nextSibling.focus()
        else if (e.target.value.length == 3 && index == 2) e.target.value = e.target.value.slice(0, 2)
        else if (e.target.value.length == 0 && index != 1) e.target.previousSibling.previousSibling.focus()
    }

    useEffect(() => {
        calculateCartTotalPrice(confirmedCart)
    }, [confirmedCart])

    return (
        <div className="payment-page container">
            <h3>Payment Page</h3>
            <div className="payment-page-left-side">
                <div className="delivery-address-div">
                    <h4>Choose Delivery Address</h4>
                    {user?.addresses?.map((item, index) =>
                        <div style={{ border: deliveryAddress == item ? '2px solid #22c55e' : '' }} onClick={() => setDeliveryAddress(item)} key={index} className="address-div">
                            <span className="address-title-span">{item.addressTitle}</span>
                            <span className="address-span">{item.address}</span>
                        </div>
                    )}
                </div>
                <div className="contact-informations">
                    <h4>Contact Informations</h4>
                    {user && user.userInformations &&
                        <form style={{ border: choosedContantInformations == 'default' ? '2px solid #22c55e' : '' }}
                            onClick={() => setChoosedContantInformations('default')}
                            className="contact-informations-children-div form">
                            <span className="form-header">Listed Contact Informations</span>
                            <div className="form-item">
                                <span>First Name</span>
                                <input type="text" defaultValue={user.firstName} disabled />
                            </div>
                            <div className="form-item">
                                <span>Last Name</span>
                                <input type="text" defaultValue={user.lastName} disabled />
                            </div>
                            <div className="form-item">
                                <span>Telephone</span>
                                <input type="text" defaultValue={user.userInformations.telephone} disabled />
                            </div>
                        </form>}
                    <form style={{ border: choosedContantInformations == 'different' ? '2px solid #22c55e' : '' }}
                        onClick={() => setChoosedContantInformations('different')} className="form">
                        <span className="form-header">Different Contact Informations</span>
                        <div className="form-item">
                            <span>First Name</span>
                            <input onChange={(e) => setFirstName(e.target.value)} type="text"></input>
                        </div>
                        <div className="form-item">
                            <span>Last Name</span>
                            <input onChange={(e) => setLastName(e.target.value)} type="text"></input>
                        </div>
                        <div className="form-item">
                            <span>Telephone</span>
                            <input onChange={(e) => setTelephone(e.target.value)} type="text"></input>
                        </div>
                    </form>
                </div>
                <div className="card-informations">
                    <h4>Card Informations</h4>
                    <form className="form">
                        <div className="form-item">
                            <span>Card Number</span>
                            <div className="card-number-inputs">
                                <input onInput={(e) => {
                                    setCardNumber1(e.target.value)
                                    dynamicInputHandle(e, 1)
                                }} type="text" />
                                <input onInput={(e) => {
                                    setCardNumber2(e.target.value)
                                    dynamicInputHandle(e, 2)
                                }} type="text" />
                                <input onInput={(e) => {
                                    setCardNumber3(e.target.value)
                                    dynamicInputHandle(e, 3)
                                }} type="text" />
                                <input defaultValue={cardNumber4} onInput={(e) => {
                                    setCardNumber4(e.target.value)
                                    dynamicInputHandle(e, 4)
                                }} type="text" />
                            </div>
                        </div>
                        <div className="form-row-item">
                            <div className="row-children">
                                <span>Expiration Date</span>
                                <div>
                                    <input onInput={(e) => {
                                        setExpirationDateMonth(e.target.value)
                                        dynamicInputForExpirationDateInput(e, 1)
                                    }} type="text" />
                                    <span>/</span>
                                    <input onInput={(e) => {
                                        setExpirationDateYear(e.target.value)
                                        dynamicInputForExpirationDateInput(e, 2)
                                    }
                                    } type="text" />
                                </div>
                            </div>
                            <div className="row-children">
                                <span>Security Code (CVV)</span>
                                <input onChange={(e) => setCvv(e.target.value)} type="text" />
                            </div>
                        </div>
                        <div className="form-item">
                            <span>Name on Card</span>
                            <input onChange={(e) => setNameOnCard(e.target.value)} type="text" />
                        </div>
                    </form>
                </div>
            </div>
            <div className="payment-page-right-side">
                <div className="cart-informations">
                    <div>
                        <span>Total Cart Price</span>
                        <span>{totalPrice && totalPrice}</span>
                    </div>
                    <div>
                        <span>Shipping Cost</span>
                        <span>{shippingCost && shippingCost}</span>
                    </div>
                    <div className="cart-last-price">
                        <span>{totalPrice + shippingCost}</span>
                    </div>
                </div>
                {shoppingMsg && <span className="form-msg">{shoppingMsg}</span>}
                <button onClick={() => completeShopping()} className="complate-shopping-btn blue-btn">Complate Shopping</button>
            </div>
        </div>
    )
}