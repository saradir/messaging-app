import { Outlet } from "react-router-dom";
import { LeftPanel } from "./LeftPanel";
import { useState, useEffect } from "react";
import { fetchConversations } from "../services/conversations";
import "../styles/AppLayout.css"


export function AppLayout() {

  const [conversations, setConversations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  async function loadConversations(){
      try {
          const conversations = await fetchConversations();
          setConversations(conversations);
      } catch (err) {
          setError("Failed to retrieve conversations");
          console.error("Error: ", err)           
      } finally{
          setLoading(false);
      }
  }

  loadConversations();
  }, []);

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="app-layout">
      <LeftPanel conversations={conversations} />
      <div className="main-panel">
        <Outlet />
      </div>
    </div>
  );
}