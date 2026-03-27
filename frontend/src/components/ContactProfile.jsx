import "../styles/ContactProfile.css"

export function ContactProfile({contact, isInContacts, onAdd, onRemove, pending}){


 
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
                {isInContacts
                    ?<button className="remove-button" disabled={pending} onClick={() => onRemove(contact.id)}>Remove</button>
                    :<button className="add-button" disabled={pending}  onClick={() => onAdd(contact.id)}>Add</button>
                }
            </div>

        </div>
    )
}