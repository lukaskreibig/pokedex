import React, { useEffect, useState } from 'react';
import '../App.scss';
import { gql, useLazyQuery } from '@apollo/client';

type Props = {
    // handleSearch: any;
    // setState: (val: string) => void;
    handleSearch: (results:any) => any;
    // placeholder: string;
  };

const Search:React.FC<Props> = (Props) => {

const [search, setSearch] = useState<boolean>(false)
const [searchInput, setSearchInput] = useState<string>("")

console.log(searchInput)

const SEARCH_POKEMON = gql`
query pokemon($name: String!) {
  pokemon(name: $name) {
    id
    name
    sprites {
      front_default
    }
    moves {
      move {
        name
      }
    }
    types {
      type {
        name
      }
    }
  }
}
`
  
   
        const [searchNow, { loading, data, error }] = useLazyQuery(SEARCH_POKEMON, {
            variables: {
            name: searchInput.toLowerCase(),
            },
        });

       

    const activateSearch = (e:React.ChangeEvent<HTMLInputElement>): void => {
        setSearchInput(e.target.value);
        searchNow();
      };

    if(data){Props.handleSearch([data])}



    console.log(loading)
    console.log("Data", data)
    console.log(error)
    console.log(searchInput)




  return (

    <li className={"searchbar"} id={search ? "searchbar-clicked" : undefined} onClick={() => setSearch(true)}> {
    (
      <form onSubmit={((e:React.FormEvent<HTMLFormElement>) => {e.preventDefault()})} >
        <label>
          <input
            name="search"            
            type="text"
            placeholder="Search"
            onChange={(e) => {activateSearch(e)}}
            />
        </label>
        </form>
    )}</li>

    )}

export default Search;
