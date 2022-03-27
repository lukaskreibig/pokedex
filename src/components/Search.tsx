import React, { useEffect, useState } from 'react';
import '../App.scss';
import { gql, useLazyQuery } from '@apollo/client';

type Props = {
    handleSearch: (results:any) => any;
  };

const Search:React.FC<Props> = (Props) => {

const [search, setSearch] = useState<boolean>(false)
const [searchInput, setSearchInput] = useState<string>("")
const [searchResults, setSearchResults] = useState<any>([])


const SEARCH_POKEMON = gql`
query pokemon($name: String!) {
  pokemon(name: $name) {
    id
    name
    sprites { front_default }
  }
}
`
   
        const [searchNow, { loading, data, error }] = useLazyQuery(SEARCH_POKEMON, {
            variables: {
            name: searchInput
            },
        });

       

    const activateSearch = (e:any): void => {
        e.preventDefault()
        searchNow().then(data => {
              Props.handleSearch([data.data.pokemon])
        })
      };




  return (

    <li className={"searchbar"} id={search ? "searchbar-clicked" : undefined} onClick={() => setSearch(true)}> {
    (
      <form onSubmit={(e) => activateSearch(e)} >
        <label>
          <input
            name="search"            
            type="text"
            placeholder="Search"
            onChange={(e) => {setSearchInput(e.target.value)}}
            />
        </label>
        </form>
    )}</li>

    )}

export default Search;
