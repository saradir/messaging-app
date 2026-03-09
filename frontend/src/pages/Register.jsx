import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register(){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassowrd, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    async function onSubmit(e){
        e.preventDefault();
        setSubmitting(true);
        setMessage('');
        try{
            const response = await  fetch(`${import.meta.env.VITE_API_SERVER}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    "email" : e.target.email.value,
                    "password": e.target.password.value,
                    "username": e.target.username.value              
                })
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || "Registration failed");
            
            return;
            }
            navigate("/login");
        
        } catch (err) {
            if(err.name !== "Abortmessage") setMessage(err.message);
        } finally {
                setSubmitting(false);
        }



}
if(submitting) return <p>Logging in...</p>


    return(
        <div>
            <form className="login-form" method="post" onSubmit={onSubmit}>

                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" required value={username} onChange={(e) => setUsername(e.target.value)}></input>

                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)}></input>

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)}></input>

                <label htmlFor="confirm-password">Confirm password: </label>
                <input type="password" id="confirm-password" name="confirm-password" required value={confirmPassowrd} onChange={(e) => setConfirmPassword(e.target.value)}></input>

                <button type="submit" disabled={!email || !password} >Sign up</button>
            </form>
            <p>{message}</p>
        </div>
    )
}
