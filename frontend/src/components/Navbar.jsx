import { NavLink } from "react-router-dom";

import "../styles/Navbar.css";


export function Navbar({view, setView}){
    return(
        <nav className="navbar">
            <button className={`nav-chats button ${view==="chats"? "active":""}`} onClick={() => setView("chats")}>Chats </button> 
            <button  className={`nav-contacts button ${view==="contacts"? "active":""}`} onClick={() => setView("contacts")}>Contacts </button>
        </nav>
    )
}