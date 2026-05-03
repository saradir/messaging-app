import { useState, useEffect} from "react"
import ContactsList from "../components/ContactsList";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import { ContactProfile } from "../components/ContactProfile";
import { Modal } from "../components/Modal";
import { addContact, fetchContacts, removeContact } from "../services/contacts";
import { startConversation } from "../services/conversations"
import "../styles/Contacts.css";
import { useModal } from "../hooks/useModal";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../stores/chatStore";

export function Contacts({setView}){
    const contactProfile = useModal();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [searchMode, setSearchMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pending, setPending] = useState(false);
    const updateNewConversation = useChatStore((state) => state.updateNewConversation)

    async function handleRemoveContact(contactId){

        setPending(true);

        try{
            const result = await removeContact(contactId);
            if(result){
                const newContacts = contacts.filter(c => c.id !== contactId);
                setContacts(newContacts);
            }
        } catch (err){
            console.error(err)
        } finally{
            setPending(false);
        }
    }

    async function handleRowClick(userId){       
        const conversation = await startConversation(userId);
        updateNewConversation(conversation);
        navigate(`/conversations/${conversation.id}`);
        setView("chats");
    }

    

    function viewUserProfile(user){
        setSelectedUser(user);
        contactProfile.open();
    }

    function isInContacts(id){
        return contacts.some(c => c.id === id);
    }

    async function handleAdd(id){

        setPending(true);
        try{
            const result = await addContact(id);

            if(result.success){
                 setContacts(prev => [...prev, result.data]);
            }
            
        } catch (error){
            console.error(error.message);
        } finally {
            setPending(false);
        }
    }


    async function handleSearch(query){

        setSearchMode(true);

        try{
            const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/contacts/search?q=${query}`, {
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
            :<ContactsList contacts={contacts} viewUserProfile={viewUserProfile} handleRowClick={handleRowClick} />
            }

            { contactProfile.isOpen &&
                <Modal  onClose={contactProfile.close}>
                    <ContactProfile contact={selectedUser} isInContacts={isInContacts(selectedUser.id)} onAdd={handleAdd} onRemove={handleRemoveContact} pending={pending} />
                </Modal>
            }

        </div>
    )
}