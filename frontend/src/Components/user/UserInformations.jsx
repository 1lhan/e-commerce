import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import UserPageNavbar from "./UserPageNavbar"
import { updateUser } from "../../Slices/authSlice"

export default function UserInformations() {

    const { user } = useSelector(state => state.auth)
    const { url } = useSelector(state => state.siteConfig)
    const dispatch = useDispatch()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [telephone, setTelephone] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [gender, setGender] = useState('')

    useEffect(() => {
    }, [])

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
            console.log('User Informations update succesful')
            dispatch(updateUser(_update.user))
        }
        else console.log('User Informations update faile')
    }

    return (
        <div className="user-informations-page container">
            <UserPageNavbar />
            <div className="content-div">
                <h3 className="content-div-header">User Informations</h3>
                <form onSubmit={updateUserInformations} className="form">
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
                        <input onChange={(e) => setBirthDate(e.target.value)} defaultValue={user?.userInformations?.birthDate.slice(0, 10)} type="date" />
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
            </div>
        </div>
    )
}