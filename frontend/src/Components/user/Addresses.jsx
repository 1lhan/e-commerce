import { useEffect, useState } from "react"
import UserPageNavbar from "./UserPageNavbar"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../../Slices/authSlice"
import { useLocation } from "react-router-dom"
import { dynamicTitle } from "../../Slices/siteConfigSlice"

export default function Addresses() {

    const { url } = useSelector(state => state.siteConfig)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const location = useLocation()

    const [addressTitle, setAddressTitle] = useState('')
    const [address, setAddress] = useState('')
    const [formMsg, setFormMsg] = useState('')
    const [addAddressFormDisplay, setAddAddressFormDisplay] = useState(false)
    const [infoDivText, setInfoDivText] = useState('')

    const addAddress = async (e) => {
        e.preventDefault()

        if (addressTitle.length < 1) setFormMsg('Address title character length should be more than 1')
        else if (address.length < 20) setFormMsg('Address character length should be more than 20')
        else {
            let _addAddress = await fetch(url + '/address-actions', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json,text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'add-address', userId: user._id, reqData: { addressTitle, address } })
            }).then(_res => _res.json())

            if (_addAddress.action) {
                setInfoDivText('Address added')
                e.target.reset()
                setAddAddressFormDisplay(false)
                dispatch(updateUser(_addAddress.user))

            }
        }
    }

    const deleteAddress = async (addressId) => {
        if (confirm('Are you sure that you want delete address ?')) {
            let _deleteAddress = await fetch(url + '/address-actions', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json,text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'delete-address', userId: user._id, reqData: { addressId } })
            }).then(_res => _res.json())

            if (_deleteAddress.action) {
                setInfoDivText('Address deleted')
                dispatch(updateUser(_deleteAddress.user))
            }
        }
    }

    const updateAddress = async (e, addressId, index) => {
        let _addressTitle = e.target.parentNode.parentNode.children[1].children[1].value
        let _address = e.target.parentNode.parentNode.children[2].children[1].value

        if (user.addresses[index].addressTitle != _addressTitle || user.addresses[index].address != _address) {
            let _updateAddress = await fetch(url + '/address-actions', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json,text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'update-address', userId: user._id, reqData: { addressId, addressTitle: _addressTitle, address: _address } })
            }).then(_res => _res.json())

            if (_updateAddress.action) {
                addressFormActiveHandle(e)
                setInfoDivText('Address updated')
                dispatch(updateUser(_updateAddress.user))
            }
        }
    }

    const addressFormActiveHandle = (e, index) => {
        if (e.target.parentElement.parentElement.children[1].childNodes[1].disabled == true) {
            e.target.parentNode.children[3].style.display = 'none'
            e.target.parentNode.children[2].style.display = 'flex'
            e.target.parentNode.children[1].style.display = 'flex'

            e.target.parentElement.parentElement.children[1].childNodes[1].disabled = false
            e.target.parentElement.parentElement.children[2].childNodes[1].disabled = false
        }
        else {
            e.target.parentNode.children[3].style.display = 'flex'
            e.target.parentNode.children[2].style.display = 'none'
            e.target.parentNode.children[1].style.display = 'none'

            if (e.target.className == "fa-solid fa-xmark") {
                e.target.parentElement.parentElement.children[1].childNodes[1].value = user.addresses[index].addressTitle //address title
                e.target.parentElement.parentElement.children[2].childNodes[1].value = user.addresses[index].address //address
            }

            e.target.parentElement.parentElement.children[1].childNodes[1].disabled = true
            e.target.parentElement.parentElement.children[2].childNodes[1].disabled = true
        }
    }

    useEffect(() => {
        dispatch(dynamicTitle(location.pathname.slice(1)))
    }, [user, location])

    return (
        <div className="addresses-page container">
            {infoDivText && <div className="info-div">
                <span>{infoDivText}</span>
                <i onClick={() => setInfoDivText('')} className="fa-solid fa-xmark" />
            </div>}
            <UserPageNavbar />
            <div className="main-section">
                <div className="main-section-header-div">
                    <h3 className="main-section-header">Addresses</h3>
                    <i onClick={() => setAddAddressFormDisplay(!addAddressFormDisplay)} className="add-address-btn fa-solid fa-plus" />
                </div>
                <form style={{ display: addAddressFormDisplay ? 'flex' : 'none' }} onSubmit={addAddress} className="add-address-form form">
                    <span className="form-header">
                        Add Address
                        <i onClick={() => setAddAddressFormDisplay(!addAddressFormDisplay)} className="fa-solid fa-xmark" />
                    </span>
                    <div className="form-item">
                        <span>Address Title</span>
                        <input onChange={(e) => setAddressTitle(e.target.value)} type="text" />
                    </div>
                    <div className="form-item">
                        <span>Address</span>
                        <textarea onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    {formMsg && <span className="form-msg-span">{formMsg}</span>}
                    <button className="submit-btn" type="submit">Add Address</button>
                </form>
                <div className="addresses">
                    {user && user.addresses && user.addresses.map((address, index) =>
                        <form key={index} className="address form">
                            <div className="address-buttons">
                                <i onClick={() => deleteAddress(address._id)} className="fa-regular fa-trash-can" />
                                <i onClick={(e) => updateAddress(e, address._id, index)} className="fa-solid fa-check" />
                                <i onClick={(e) => addressFormActiveHandle(e, index)} className="fa-solid fa-xmark" />
                                <i onClick={(e) => addressFormActiveHandle(e)} className="fa-regular fa-pen-to-square" />
                            </div>
                            <div className="form-item">
                                <span>Address Title</span>
                                <input defaultValue={address.addressTitle} type="text" name="addressTitle" disabled />
                            </div>
                            <div className="form-item">
                                <span>Address</span>
                                <textarea defaultValue={address.address} name="address" disabled />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}