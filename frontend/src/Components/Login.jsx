import { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { dynamicTitle } from "../Slices/siteConfigSlice"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../Slices/authSlice"

export default function Login() {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { url } = useSelector(state => state.siteConfig)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [formMsg, setFormMsg] = useState('')

    const loginSubmit = async (e) => {
        e.preventDefault()

        if (!email.includes('@') || email.length < 6) {
            setFormMsg('Invalid email')
        }
        let _login = await fetch(url + '/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            body: JSON.stringify({ email, password })
        }).then(_res => _res.json())

        if (_login.action) {
            dispatch(login(_login.user))

            const d = new Date()
            d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days
            let expires = "; expires=" + d.toUTCString()
            document.cookie = 'token=' + _login.token + expires + ';' + 'path=/;';
            
            navigate('/')
        }
        else setFormMsg(_login.action.msg)
    }

    useEffect(() => {
        dispatch(dynamicTitle(location.pathname.slice(1)))
    }, [])

    return (
        <div className="login-page container">
            <form onSubmit={loginSubmit} id="login-form" className="form login-form">
                <div className="choose-form-div">
                    <NavLink style={{ color: location.pathname == '/login' ? '#22d3ee' : '' }} to='/login'>Login</NavLink>
                    <NavLink style={{ color: location.pathname == '/register' ? '#22d3ee' : '' }} to='/register'>Register</NavLink>
                </div>
                <span className="form-item">
                    <span>Email</span>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" />
                </span>
                <span className="form-item">
                    <span>Password</span>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" />
                </span>
                {formMsg && <span className="form-msg-span">{formMsg}</span>}
                <button className="submit-btn" type="submit">Login</button>
            </form>
        </div>
    )
}