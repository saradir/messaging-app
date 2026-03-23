
function ContactsList({ contacts }){

    if(!contacts || contacts.length === 0) return <p>No contacts yet</p>
    
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