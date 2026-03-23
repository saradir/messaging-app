import { useState } from "react";

export function MessageComposer({handleSubmit}){
    const [input, setInput] = useState('');

    async function submitForm(e){
        e.preventDefault();
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

            </textarea>

            <button type="submit" className="submit-button">Send</button>
        </form>
    )
}