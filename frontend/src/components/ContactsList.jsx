import "../styles/ContactsList.css";
import { UserRow } from "./UserRow";

function ContactsList({ contacts, viewUserProfile, handleRowClick}){

    if(!contacts || contacts.length === 0) return <div className="empty-state">No contacts yet</div>

    return(
        <div className="contact-list">
            { contacts.map( c => (
                < UserRow key={c.id} user={c} viewUserProfile={viewUserProfile} onClick={handleRowClick} />
            ))}
        </div>     
    )
}

export default ContactsList;