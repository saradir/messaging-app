import { NavLink } from "react-router-dom";

import "../styles/Navbar.css";


export function Navbar(){
    return(
        <nav className="navbar">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-chats active" : "nav-chats"}>Chats</NavLink>
            <NavLink to="/contacts" className={({ isActive }) => isActive ? "nav-contacts active" : "nav-contacts"}>Contacts</NavLink>
        </nav>
    )
}