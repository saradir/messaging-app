import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({children}){
    const {currentUser} = useContext(AuthContext);
    console.log(currentUser)

    if(!currentUser){
        return <Navigate to="/login" replace />
    }

    return children;
}