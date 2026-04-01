import Homepage from "../pages/Homepage";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Contacts } from "../pages/Contacts";
import { useState } from "react";
import "../styles/LeftPanel.css"
export function LeftPanel() {

    const [view, setView] = useState("chats");
    const [selectedRow, setSelectedRow] = useState(null);

    return (
        <div className="left-panel">
            <Navbar view={view} setView={setView} />

            <Sidebar>
                {view === "contacts" ? <Contacts /> : <Homepage />}
            </Sidebar>


        </div>
    );
}