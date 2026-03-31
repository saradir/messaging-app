import { useState } from "react";
import "../styles/SearchForm.css";

export function SearchForm({handleSearch, setSearchMode, searchMode}){

    const [query, setQuery] = useState('');

    function onSubmit(e){
        e.preventDefault();
        handleSearch(query);
        
    }

    function handleAbort(){
        setSearchMode(false)
        setQuery('');
    }

    return(
        <form className="search-form"   autoComplete="new-password" onSubmit={onSubmit}>
            <input
                type="text"
                autoComplete="new-password"
                min={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type username or email to look them up"
            />

            {searchMode && <button type="button" onClick={handleAbort} >Back</button>}

            <button type="submit" disabled={query.length < 4}>Search</button>
        </form>
    )
}