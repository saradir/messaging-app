export async function startConversation(userId){

        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/conversations/`,{
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