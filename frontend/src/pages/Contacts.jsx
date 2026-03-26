import { useState, useEffect} from "react"
import ContactsList from "../components/ContactsList";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import { ContactProfile } from "../components/ContactProfile";
import { Modal } from "../components/Modal";
import { addContact, fetchContacts } from "../services/contacts";
import { startConversation } from "../services/conversations"
import "../styles/Contacts.css";
import { useModal } from "../hooks/useModal";
import { useNavigate } from "react-router-dom";

export function Contacts(){
    const contactProfile = useModal();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [searchMode, setSearchMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    async function handleRowClick(userId){       
        const {id} = await startConversation(userId);
        navigate(`/conversations/${id}`);
    }

    

    function viewUserProfile(user){
        setSelectedUser(user);
        contactProfile.open();
    }

    function isInContacts(id){
        return contacts.some(c => c.id === id);
    }

    async function handleAdd(id){
        try{
            const contact = await addContact(id);
            if(contact) setContacts(prev => [...prev, contact]);
        } catch (error){
            console.error(error.message);
        }

    }


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
            ?<SearchResults contacts={searchResults} viewUserProfile={viewUserProfile} handleRowClick={handleRowClick} />
            :<ContactsList contacts={contacts} viewUserProfile={viewUserProfile} handleRowClick={handleRowClick}/>
            }

            { contactProfile.isOpen &&
                <Modal  onClose={contactProfile.close}>
                    <ContactProfile contact={selectedUser} isInContacts={isInContacts} onAdd={handleAdd} />
                </Modal>
            }

        </div>
    )
}