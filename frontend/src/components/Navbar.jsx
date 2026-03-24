import { Link } from "react-router-dom";

import "../styles/Navbar.css";


export function Navbar(){
    return(
        <nav className="navbar">
            <Link to="/" className="Chats">Chats</Link>
            <Link to="/contacts">Contacts</Link>
        </nav>
    )
}