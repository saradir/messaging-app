export function UserRow( {user, onClick, onView} ){
    return(
        <div className="user-row" onClick={() => onClick(user.id)} >
            <div className="left-side">
                <div className="username">
                    {user.username}
                </div>

            </div>

            <div className="right-side">
                <button className="view-button">View</button>
            </div>
        </div>
    )
}