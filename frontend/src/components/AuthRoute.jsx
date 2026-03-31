import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function AuthRoute(){
    const {currentUser} = useContext(AuthContext);
  

    if(currentUser){
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}