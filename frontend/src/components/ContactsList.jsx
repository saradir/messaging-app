import "../styles/ContactsList.css";

function ContactsList({ contacts }){

    if(!contacts || contacts.length === 0) return <div className="empty-state">No contacts yet</div>
    
    return(

        <div className="contact-list">
            { contacts.map( c => (
                <div key={c.id} className="contact" >
                    <div className="contact-title">
                        {c.username}
                    </div>


                </div>
            ))}
        </div>     
    )
}

export default ContactsList;