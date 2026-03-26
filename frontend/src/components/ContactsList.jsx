import "../styles/ContactsList.css";
import { UserRow } from "./UserRow";

function ContactsList({ contacts }){

    if(!contacts || contacts.length === 0) return <div className="empty-state">No contacts yet</div>
    
    return(

        <div className="contact-list">
            { contacts.map( c => (
                < UserRow key={c.id} user={c} />
            ))}
        </div>     
    )
}

export default ContactsList;