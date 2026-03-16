import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MessageBox } from "../components/MessageBox";

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
            const response = await  fetch(`${import.meta.env.VITE_API_SERVER}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
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
            console.log(data.user);
            setCurrentUser(data.user);
            
            navigate("/");
        
        } catch (err) {
            if(err.name !== "Abortmessage") setMessage(err.message);
        } finally {
                setSubmitting(false);
        }



}
if(submitting) return <p>Logging in...</p>


    return(
        <>
            {message && <MessageBox type={status}>{message}</MessageBox>}
            <form className="login-form" method="post" onSubmit={onSubmit}>
                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit" disabled={!email || !password} >Login</button>
            </form>
            
        </>
    )
}
