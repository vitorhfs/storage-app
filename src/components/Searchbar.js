import React, { useEffect, useState } from 'react';
import { useDataLayerValue } from '../context/DataLayer';

const SearchBar = () => {
    const [ { searchResult }, dispatch] = useDataLayerValue();
    const [ searchInput, setSearchInput ] = useState('');

    useEffect(() => {
        dispatch({
            type: 'SET_SEARCH',
            payload: searchInput
        })
        console.log(searchResult);
    }, [searchInput]);

    return (
        <div className="searchbar">
            <input 
                className="searchbar__input" 
                placeholder="Procure seu produto aqui"
                value={searchInput}
                onChange={(event) => {setSearchInput(event.target.value)}}
            />
        </div>
    )
}

export default SearchBar;