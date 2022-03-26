import React, { useEffect, useState } from 'react';
import './App.scss';
import { gql, useQuery } from '@apollo/client';
import Search from './components/Search';
import heart from './assets/heart.png'
import noheart from './assets/noheart.png'



function App() {

const [sort, setSort] = useState<boolean>(false)
const [favourite, setFavourite] = useState<boolean>(false)
const [storage, setStorage] = useState<any>([])
const [search, setSearch] = useState<boolean>(false)
const [searchResults, setSearchResults] = useState<any>([])
const [loadingSearch, setLoadingSearch] = useState<boolean>(false)

  const GET_POKEMON = gql`
  query pokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      count
      next
      previous
      nextOffset
      prevOffset
      status
      message
      results {
        id
        artwork
        url
        name
        image
      }
    }
  }
`;

  useEffect(():void => {
    const storage = JSON.parse(localStorage.getItem('storage') || "");
    if (storage) {
    setStorage(storage);
    }
  }, []);

  useEffect(():void => {
      localStorage.setItem('storage', JSON.stringify(storage));
  }, [storage]);


  const triggerLike = (x:any, heart?:any):void => {
    if (!heart)  {
    setStorage([...storage, x])
    } else {
    setStorage(storage.filter((obj: { id: any; }) => obj.id !== x.id))
    }
  }

  const { loading, error, data } = useQuery(GET_POKEMON, {variables: {limit: 20}} );
  // (error ? (console.log(`Error! ${error.message}`)) : null)

  let newPokemon:any = null
  if (data) {newPokemon = [...data.pokemons.results]}

  let placeholder
  favourite ? placeholder = storage : search && searchResults ? placeholder = searchResults : placeholder = newPokemon


  let handleSearch = (results:any):void => {
    if(results[0].id !== null){
      setSearch(true);
      setSearchResults(results);
    } else {
      setSearchResults([{
        "name": "Nope. No Pokemon Found.",
        "sprites": {"front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png"},
        "notacard" : true
      }]);
      setSearch(true)
    }
    console.log("Passing up results", results)
  }

  
  console.log("Placeholder", placeholder)

  return (
    <div className="app">
  {loading || loadingSearch ? 'Loading...' : (
<>
  <header> Pokédex </header>

  <ul className="appgrid">

    <Search handleSearch={handleSearch} />

    <li className={"searchbar"} id={null ?? "searchbar-clicked"}> Filter</li>
    <li className={"searchbar"} onClick={() => setSort(!sort)}> {sort ? "Sort from Z-A" : "Sort from A-Z"} </li>
    <li className={"searchbar"} id={favourite ? "searchbar-clicked" : undefined} onClick={() => setFavourite(!favourite)}> Favourites</li>
      {
        placeholder
        // .sort((a: { name: string; }, b: { name: string; }) => sort ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name))

        .map((x:any, index:number) => { 
         return (
         <li className="gridchild" key={index}>
           <div className="boxcontent">
            <div className="pokemonname">{x.name}</div>
            <img src={(x.artwork ? x.artwork : x.sprites.front_default)} alt="Pokemon" />
            {(storage.filter((obj: { id: any; }) => obj.id === x.id)).length ? 
            <img src={heart} className={"like"} onClick={() => {triggerLike(x, heart)}} alt="Like"/>
            : !x.notacard ?
            <img src={noheart} className={"like"} onClick={() => {triggerLike(x)}} alt="No Like"/>
            : null
            }
            </div>
         </li>
         
         

       )})
     }
  </ul>  
  </>
  )}

  

    </div>
  );
}

export default App;
