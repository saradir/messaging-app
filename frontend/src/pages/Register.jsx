import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageBox } from "../components/MessageBox";

export default function Register(){
    

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    function handleChange(e){
       const  { value, name} = e.target;

       const newFormData={
        ...formData,
        [name]: value
       }
       setFormData(newFormData);
       
       // If field failed validation previously, revalidate on change.
       if(errors[name] || name === "password"){
        validateField(newFormData, name);
       }
    }


    function validateField(data, field){
        // for the time being, validate only passwords match and use html for the rest
        if(field === "confirmPassword" || field === "password"){
            if(data.confirmPassword !== data.password){
                setErrors(prev => ({...prev, confirmPassword: "Passwords do not match"}));
                
            } else{
                setErrors(prev => ({...prev, confirmPassword:""}))
               

            }
        }
    }
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
                    "email" : formData.email,
                    "password": formData.password,
                    "confirmPassword": formData.confirmPassword,
                    "username": formData.username           
                })
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || "Registration failed");
                setStatus("error");
            
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
        <>
            <h1>Register</h1>
            {message && <MessageBox type={status}>{message}</MessageBox>}
            <form className="login-form" method="post" onSubmit={onSubmit}>

                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" pattern="[A-Za-z0-9_]+" minLength={4} maxLength={12} required value={formData.username} onChange={e => handleChange(e)} />
                {errors.username && <span className="field-error">{errors.username}</span>}

                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={e => handleChange(e)} />
                {errors.email && <span className="field-error">{errors.email}</span>}

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" minLength={4} maxLength={22} required value={formData.password} onChange={e => handleChange(e)} />
                {errors.password && <span className="field-error">{errors.password}</span>}

                <label htmlFor="confirmPassword">Confirm password: </label>
                <input type="password" id="confirmPassword" name="confirmPassword" onBlur={(e) => validateField(formData, e.target.name)} required value={formData.confirmPassword} onChange={e => handleChange(e)} />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}

                <button type="submit" disabled={!formData.email || !formData.password}>Sign up</button>
            </form>
            <p>{message}</p>
        </>
    )
}
