import Homepage from "../pages/Homepage";
import { Contacts } from "../pages/Contacts";

export function Sidebar({children}){
    return(
        <div className="sidevar">
            {children}
        </div>
    )
}