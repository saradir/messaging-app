import { Outlet } from "react-router-dom";
import { LeftPanel } from "./LeftPanel";
import "../styles/AppLayout.css"

export function AppLayout() {
  return (
    <div className="app-layout">
      <LeftPanel conversations={conversations} />
      <div className="main-panel">
        <Outlet />
      </div>
    </div>
  );
}