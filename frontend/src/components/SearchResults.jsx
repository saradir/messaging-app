import { UserRow } from "./UserRow"
import { startConversation } from "../services/conversations"
import { useNavigate } from "react-router-dom";
export function SearchResults({ contacts}){

    const navigate = useNavigate();
    if(!contacts || contacts.length === 0) return <p>No matches found</p>

    async function handleClick(userId){
        const {id} = await startConversation(userId);
        navigate(`/conversations/${id}`);
    }
    
    return(

        <div className="search-results">
            { contacts.map( c => (

                <UserRow key={c.id} user={c} onClick={handleClick} />
            ))}

        </div>     
    )
}

