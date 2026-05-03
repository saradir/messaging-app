import { useNavigate } from "react-router-dom"
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function Logout(){
    const {setCurrentUser} = useContext(AuthContext);
     
    const navigate = useNavigate();
    useEffect(() => {
        async function logout() {
        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/auth/logout`, { method: "POST", credentials: "include", cache: "no-store" });
        if(!response.ok){
            console.error("Something went wrong");
            return;
        }
        setCurrentUser(null);
        navigate("/login");
        }

        logout();
    }, [navigate, setCurrentUser]);

  return null;
}
