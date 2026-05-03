export async function startConversation(userId){

        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/conversations/`,{
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                targetUserId: userId
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Operation failed: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    
}

export async function fetchMessages(conversationId){

    const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/conversations/${conversationId}/messages`, {
        credentials: "include"
    
    });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Operation failed: ${response.status}`);
        }

        const data = await response.json();
        return data.data;

}

export async function sendMessage(message){

    const {conversationId, content, clientId } =  message ;
    const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/conversations/${message.conversationId}/messages`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                conversationId,
                clientId,
                content
            })
        });


        if(!response.ok){
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Operation failed: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    }

export async function fetchConversations(){

    const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/conversations`,{
        credentials: "include"
    });

    if(!response.ok){
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Operation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
}

export async function updateLastSeenMessage(conversationId, messageId){
    const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/conversations/${conversationId}/last-seen`,{
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
            messageId
        }),
        headers: {
            "Content-Type": "application/json"
        },
    });

    if(!response.ok){
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Operation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
}


        
