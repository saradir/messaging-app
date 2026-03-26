import "../styles/ContactProfile.css"

export function ContactProfile({contact, isInContacts, onAdd}){

    const inContacts = isInContacts(contact.id);
    console.log(contact.email)

    if (!contact) return null;
    return (
        <div className="contact-profile">
            <div className="personal-details">
                <div className="contact-name">
                    Username: {contact.username}
                </div>

                <div className="email">
                    Email: {contact.email}
                </div>               
            </div>

            <div className="profile-controls">
                <button className="add-button" disabled={inContacts} onClick={() => onAdd(contact.id)}>Add</button>
            </div>

        </div>
    )
}