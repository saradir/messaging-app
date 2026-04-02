import "../styles/ContactsList.css";
import { UserRow } from "./UserRow";

function ContactsList({ contacts, viewUserProfile, handleRowClick, selectedRow }){
    if(!contacts || contacts.length === 0) return <div className="empty-state">No contacts yet</div>
    function isActive(contactId){
       return  selectedRow?.type === "contact" && selectedRow?.id === contactId;
    }
    return(

        <div className="contact-list">
            { contacts.map( c => (
                < UserRow key={c.id} user={c} viewUserProfile={viewUserProfile} onClick={handleRowClick} isActive={isActive(c.id)} />
            ))}
        </div>     
    )
}

export default ContactsList;