import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation } from "react-router-dom"
import { dynamicTitle } from "../Slices/siteConfigSlice"

export default function Register() {
    const location = useLocation()
    const dispatch = useDispatch()
    const { url } = useSelector(state => state.siteConfig)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')
    const [formMsg, setFormMsg] = useState('')

    const registerSubmit = async (e) => {
        e.preventDefault(e)

        if (firstName.length < 3) {
            setFormMsg('First name length should be more than 2')
        }
        else if (lastName.length < 2) {
            setFormMsg('Last name length should be more than 1')
        }
        else if (!email.includes('@') || email.length < 6) {
            setFormMsg('Invalid email')
        }
        else if (password.length < 8) {
            setFormMsg('Password length might be at least 8')
        }
        else if (password != passwordAgain) {
            setFormMsg('Passwords are not same')
        }
        else {
            let register = await fetch(url + '/register', {
                method: 'POST',
                headers: { 'Accept': 'application/json, text/plain', 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password })
            }).then(_res => _res.json())
            if (register.action) {
                e.target.reset()
                setFormMsg('Register succesful')
            }
            else setFormMsg(register.action.msg)

        }
    }

    useEffect(() => {
        dispatch(dynamicTitle(location.pathname.slice(1)))
    }, [])

    return (
        <div className="register-page container">
            <form onSubmit={registerSubmit} className="form register-form">
                <div className="choose-form-div">
                    <NavLink style={{ color: location.pathname == '/login' ? '#22d3ee' : '' }} to='/login'>Login</NavLink>
                    <NavLink style={{ color: location.pathname == '/register' ? '#22d3ee' : '' }} to='/register'>Register</NavLink>
                </div>
                <span className="form-item">
                    <span>First name</span>
                    <input onChange={(e) => setFirstName(e.target.value)} type="text" />
                </span>
                <span className="form-item">
                    <span>Last name</span>
                    <input onChange={(e) => setLastName(e.target.value)} type="text" />
                </span>
                <span className="form-item">
                    <span>Email</span>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" />
                </span>
                <span className="form-item">
                    <span>Password</span>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" />
                </span>
                <span className="form-item">
                    <span>Password (Again)</span>
                    <input onChange={(e) => setPasswordAgain(e.target.value)} type="password" />
                </span>
                {formMsg && <span className="form-msg-span">{formMsg}</span>}
                <button className="submit-btn" type="submit">Register</button>
            </form>
        </div>
    )
}