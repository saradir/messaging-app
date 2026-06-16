import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MessageBox } from "../components/MessageBox";
import { Link } from "react-router-dom";
import "../styles/Login.css"

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const {setCurrentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    async function onSubmit(e){
        e.preventDefault();
        setSubmitting(true);
        setMessage('');
        try{
            const response = await  fetch(`${import.meta.env.VITE_API_SERVER}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                cache: "no-store",
                body: JSON.stringify({
                    "email" : e.target.email.value,
                    "password": e.target.password.value              
                })
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || "Login failed");
                setStatus('error')
            
            return;
            }
            setCurrentUser(data.user);
            
            navigate("/");
        
        } catch (err) {
            if(err.name !== "Abortmessage") setMessage(err.message);
        } finally {
                setSubmitting(false);
        }



}
    async function onGuestLogin() {
        setSubmitting(true);
        setMessage('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/auth/guest`, {
                method: 'POST',
                credentials: 'include',
                cache: 'no-store',
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || 'Guest login failed');
                setStatus('error');
                return;
            }
            setCurrentUser(data.user);
            navigate('/');
        } catch (err) {
            if (err.name !== 'AbortError') setMessage(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if(submitting) return <p>Logging in...</p>

    return (
    <div className="auth-page">
        {message && <MessageBox type={status}>{message}</MessageBox>}
        <p className="auth-switch">Not registered yet? <Link to="/register">Create an account</Link></p>
        <form className="login-form" method="post" onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={!email || !password}>
            Login
        </button>
        </form>
        <button type="button" className="guest-btn" onClick={onGuestLogin}>
            Preview as Guest
        </button>
    </div>
    );
}