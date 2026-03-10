export function MessageBox({children, type=''}){
    return(
        <p className={`message-box ${type}`}>
            {children}
        </p>
    )
}