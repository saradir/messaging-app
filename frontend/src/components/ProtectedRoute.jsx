import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute(){
    const {currentUser} = useContext(AuthContext);
  

    if(!currentUser){
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
}