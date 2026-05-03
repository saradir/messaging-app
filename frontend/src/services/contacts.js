export async function addContact(contactId){

    const response = await fetch(`${import.meta.env.VITE_API_SERVER}/contacts/`,{
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contactId
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Operation failed: ${response.status}`);
    }

    const data = await response.json();
    return data;   
}


export async function fetchContacts(){
    
    const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/contacts`,{
    credentials: "include"
    });

    if(!response.ok){
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Operation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
} 

export async function removeContact(contactId){
    const response = await fetch(`${import.meta.env.VITE_API_SERVER}/contacts/${contactId}`,{
        credentials: "include",
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Operation failed: ${response.status}`);
    }

    return true;
}

