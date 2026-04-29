import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import './App.css'
import Login from "./pages/Login";
import Register from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthRoute } from './components/AuthRoute';
import { Logout } from './pages/Logout';
import { Conversation } from './pages/Conversation';
import { AppLayout } from './components/AppLayout';
import { socket } from './services/socket';
import { useChatStore } from './stores/chatStore';
import { fetchConversations } from './services/conversations';

function App() {
  const setConversations = useChatStore((state) => state.setConversations);
  const setCurrentUserId = useChatStore((state) => state.setCurrentUserId);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Authenticate user
  useEffect(() => {
    async function authUser(){
      try {
        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/auth/me`, {
          credentials: "include",
          cache: "no-store",
        });
  
        if(response.ok){
          const data = await response.json();
          setCurrentUser(data);
          setCurrentUserId(data.id);
        }
      } catch (err) {
        console.error("Error contacting /auth/identify: ", err);
        setError("Server unreachable. Please try again later.");          

      }finally{
        setAuthLoading(false);
      }   
    }
    authUser();
  }, [setCurrentUserId]);

    // Connect socket
    useEffect(() => {
      
      if(!currentUser) return;
      socket.connect();

      function handleConnect() {
        console.log("client connected", socket.id);
      }

      function handleNewMessage(message){
        useChatStore.getState().receiveMessage(message);
      }

      function handleMessageSeen(membership){
        useChatStore.getState().updateLastSeenMessage(membership.conversationId, membership.userId, membership.lastSeenMessageId)
      }

      socket.on("connect", handleConnect);
      socket.on("message:new", handleNewMessage);
      socket.on("membership:updated", handleMessageSeen)
    
      return () => {
        socket.off("message:new");
        socket.off("connect");
        socket.off("membership:updated");
        socket.disconnect();
      };
  }, [currentUser]);

    // Fetch conversations
    useEffect(() => {
      let cancelled = false;      
      if(authLoading || !currentUser) return;
      async function loadConversations(){
          try {
              const conversations = await fetchConversations();
              if(!cancelled) setConversations(conversations);
          } catch (err) {
              if (!cancelled) setError("Failed to retrieve conversations");
              console.error("Error: ", err)           
          } 
      }
    
      loadConversations();
      return () => {
        cancelled = true;
      }
    }, [currentUser, setConversations, authLoading]);


  if(authLoading) return <p>Authenticating...</p>
  if(error) return <p>{error}</p>;
  return (
    <AuthContext value={{ currentUser, setCurrentUser }}>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<p>Welcome</p>} />
            <Route path="conversations/:conversationId" element={<Conversation />} />
          </Route>

          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </AuthContext>
  );

}

export default App
