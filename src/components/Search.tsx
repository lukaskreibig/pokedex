import React, { useState } from 'react';
import '../App.scss';
import { gql, useLazyQuery } from '@apollo/client';

type Props = {
    // searchInput: any;
    // setState: (val: string) => void;
    // handleOnSubmit: () => void;
    // placeholder: string;
  };

const Search:React.FC<Props> = () => {

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

    console.log(loading)
    console.log(data)
    console.log(error)
    console.log(searchInput)

    const activateSearch = (e:React.ChangeEvent<HTMLInputElement>): void => {
        setSearchInput(e.target.value);
        searchNow();
      };


  return (

    <li className="searchbar" onClick={() => setSearch(true)}> {search ? 
    (
      <form onSubmit={((e:React.FormEvent<HTMLFormElement>) => {e.preventDefault()})} >
        <label>
          <input
            name="search"            
            type="text"
            onChange={(e) => {activateSearch(e)}}
            />
        </label>
        </form>
    ) : "Search"}</li>

    )}

export default Search;
