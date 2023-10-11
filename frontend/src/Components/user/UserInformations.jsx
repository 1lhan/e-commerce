import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import UserPageNavbar from "./UserPageNavbar"
import { updateUser } from "../../Slices/authSlice"
import { useLocation } from "react-router-dom"
import { dynamicTitle } from "../../Slices/siteConfigSlice"

export default function UserInformations() {

    const { user } = useSelector(state => state.auth)
    const { url } = useSelector(state => state.siteConfig)
    const dispatch = useDispatch()
    const location = useLocation()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [telephone, setTelephone] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [gender, setGender] = useState('')

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordAgain, setNewPasswordAgain] = useState('')
    const [formMsg, setFormMsg] = useState('')
    const [infoDivText, setInfoDivText] = useState('')

    useEffect(() => {
        dispatch(dynamicTitle(location.pathname.slice(1)))
    }, [location])

    const updateUserInformations = async (e) => {
        e.preventDefault()

        let _firstName = firstName ? firstName : user.firstName;
        let _lastName = lastName ? lastName : user.lastName;
        let _email = email ? email : user.email;
        let _telephone = telephone ? telephone : user.userInformations.telephone;
        let _birthDate = birthDate ? birthDate : user.userInformations.birthDate;
        let _gender = gender ? gender : user.userInformations.gender;

        let _update = await fetch(url + '/update-user-informations', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user._id, firstName: _firstName, lastName: _lastName, email: _email, telephone: _telephone, birthDate: _birthDate, gender: _gender })
        }).then(_res => _res.json())

        if (_update.action) {
            setInfoDivText('User informations updated')
            dispatch(updateUser(_update.user))
        }
        else setInfoDivText('User Informations update fail')
    }

    const changePassword = async (e) => {
        e.preventDefault()

        if (currentPassword.length < 8) setFormMsg('Current password length should be more than 8')
        else if (newPassword.length < 8) setFormMsg('New password length should be more than 8')
        else if (newPassword != newPasswordAgain) setFormMsg('New passwords are not same')
        else {
            let _changePassword = await fetch(url + '/change-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json,text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id: user._id, currentPassword, newPassword })
            }).then(_res => _res.json())

            if (_changePassword.action) {
                setInfoDivText('Password changed')
                setFormMsg('')
                e.target.reset()
            }
            else setFormMsg(_changePassword.msg)
        }
    }

    return (
        <div className="user-informations-page container">
            {infoDivText && <div className="info-div">
                <span>{infoDivText}</span>
                <i onClick={() => setInfoDivText('')} className="fa-solid fa-xmark" />
            </div>}
            <UserPageNavbar />
            <div className="main-section">
                <div className="main-section-header-div">
                    <h3 className="main-section-header">User Informations</h3>
                </div>
                <form onSubmit={updateUserInformations} className="form user-informations-form">
                    <span className="form-row-item">
                        <div className="row-children-div">
                            <span className="item-header">First Name</span>
                            <input onChange={(e) => setFirstName(e.target.value)} defaultValue={user.firstName} type="text" />
                        </div>
                        <div className="row-children-div">
                            <span className="item-header">Last Name</span>
                            <input onChange={(e) => setLastName(e.target.value)} defaultValue={user.lastName} type="text" />
                        </div>
                    </span>
                    <span className="form-item">
                        <span>Email</span>
                        <input onChange={(e) => setEmail(e.target.value)} defaultValue={user.email} type="email" />
                    </span>
                    <div className="form-item">
                        <span className="item-header">Mobile Phone</span>
                        <input onChange={(e) => setTelephone(e.target.value)} defaultValue={user?.userInformations?.telephone} type="text" />
                    </div>
                    <div className="form-item">
                        <span className="item-header">Birth Date</span>
                        <input onChange={(e) => setBirthDate(e.target.value)} defaultValue={user?.userInformations?.birthDate?.slice(0, 10)} type="date" />
                    </div>
                    {user?.userInformations ? <div className="form-item gender-div">
                        <span className="item-header">Gender</span>
                        <select onChange={(e) => setGender(e.target.value)} defaultValue={user.userInformations.gender}>
                            <option value=""></option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div> : ''}

                    <button className="submit-btn" type="submit">Update</button>
                </form>
                <form onSubmit={changePassword} className="form change-password-form">
                    <div className="form-header-div">
                        <h4>Change Password</h4>
                    </div>
                    <div className="form-item">
                        <span>Current Password</span>
                        <input onChange={(e) => setCurrentPassword(e.target.value)} type="password" />
                    </div>
                    <div className="form-item">
                        <span>New Password</span>
                        <input onChange={(e) => setNewPassword(e.target.value)} type="password" />
                    </div>
                    <div className="form-item">
                        <span>New Password (Again)</span>
                        <input onChange={(e) => setNewPasswordAgain(e.target.value)} type="password" />
                    </div>
                    {formMsg && <span className="warning-span">{formMsg}</span>}
                    <button className="submit-btn" type="submit">Change Password</button>
                </form>
            </div>
        </div>
    )
}