import { useState, useEffect} from "react"
import ContactsList from "../components/ContactsList";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import "../styles/Contacts.css";

export function Contacts(){

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [searchMode, setSearchMode] = useState(false);


    async function handleSearch(query){

        setSearchMode(true);

        try{
            const response = await fetch(`${import.meta.env.VITE_API_SERVER}/contacts/search?q=${query}`, {
                credentials: "include"
            });

            if(!response.ok){
                setError("Something went wrong. Try to refresh the page");
                console.error("Search failed with code ", response.status);
            }

            const data = await response.json();
            setSearchResults(data.data);
        } catch (err){
            setError(err);
            console.error("Error: ", err);
        }
    }





    useEffect(() => {
        async function loadContacts(){
            try{
                const contacts = await fetchContacts();
                setContacts(contacts);
            } catch (err){
                setError(err);
                console.error("Error: ", err);
            } finally{
                setLoading(false);
            }
        }
        
        loadContacts();
    }, []);

    if(error) return <p>{error}</p>
    if(loading) return <p>Loading...</p>

    return(
        <div className="contacts-page">

            <SearchForm handleSearch={handleSearch} setSearchMode={setSearchMode} searchMode={searchMode}  />

            {searchMode
            ?<SearchResults contacts={searchResults} />
            :<ContactsList contacts={contacts} />
            }

        </div>
    )
}