import { useNavigate } from "react-router-dom"
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function Logout(){

    const {setCurrentUser} = useContext(AuthContext);
     
    const navigate = useNavigate();
    useEffect(() => {
        async function logout() {
        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/auth/logout`, { method: "POST", credentials: "include" });

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
