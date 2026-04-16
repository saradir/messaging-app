import { useState } from "react";
import  "../styles/MessageComposer.css"

export function MessageComposer({handleSubmit}){
    const [input, setInput] = useState('');

    async function submitForm(e){
        e.preventDefault();
        if(input.trim().length === 0) return;
        try{
            await handleSubmit(input);
            setInput('');
        } catch(err){
            console.error(err);
        }
    }
    return(       
        <form className="message-input" onSubmit={submitForm}>
            <textarea name="content" minLength={1} value={input} onChange={e => setInput(e.target.value)}>


            <button type="submit" className="submit-button" disabled={input.trim().length < 1}>Send</button>
        </form>
    )
}