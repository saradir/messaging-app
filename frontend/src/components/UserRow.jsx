import "../styles/UserRow.css";

export function UserRow( {user, viewUserProfile, onClick} ){

    function onView(e){
        e.stopPropagation();
        viewUserProfile(user);
    }

    return(
    <>

        <div className="user-row" onClick={() => onClick(user.id)} >
            <div className="left-side">
                <div className="username">
                    {user.username}
                </div>

            </div>

            <div className="right-side">
                <button className="view-button" onClick={e => onView(e)}>View</button>
            </div>
        </div>
    </>
    )

}