import { UserRow } from "./UserRow"
import { startConversation } from "../services/conversations"
export function SearchResults({ contacts}){

    if(!contacts || contacts.length === 0) return <p>No matches found</p>
    
    return(

        <div className="search-results">
            { contacts.map( c => (

                <UserRow key={c.id} user={c} onClick={startConversation} />
            ))}

        </div>     
    )
}

