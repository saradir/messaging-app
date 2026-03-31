import { UserRow } from "./UserRow"
import "../styles/searchResults.css";

export function SearchResults({ contacts, viewUserProfile, handleRowClick}){

    if(!contacts || contacts.length === 0) return <div className="empty-state">No matches found</div>
    return(

        <div className="search-results">
            { contacts.map( c => (

                <UserRow key={c.id} user={c} onClick={handleRowClick} viewUserProfile={viewUserProfile} />
            ))}

        </div>     
    )
}

