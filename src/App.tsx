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

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem('storage') || "");
    if (storage) {
    setStorage(storage);
    console.log("Got LocalStorage", storage)
    }
  }, []);

  useEffect(():void => {
      localStorage.setItem('storage', JSON.stringify(storage));
      console.log("Added REAL LocalStorage", localStorage)
  }, [storage]);


  const triggerLike = (x:any, heart?:any):void => {
    if (!heart)  {
    console.log("Before Adding", storage)
    setStorage([...storage, x])
    console.log("Added to Storage", storage)
    } else {
    setStorage(storage.filter((obj: { id: any; }) => obj.id !== x.id))
    }
  }

  const { loading, error, data } = useQuery(GET_POKEMON, {variables: {limit: 20}} );
  // (error ? (console.log(`Error! ${error.message}`)) : null)

  let newPokemon:any = null
  if (data) {newPokemon = [...data.pokemons.results]}

  let placeholder
  favourite ? placeholder = storage : placeholder = newPokemon

  console.log("Storage", storage)
  console.log("newPokemon", newPokemon)

  return (
    <div className="app">
  {loading ? 'Loading...' : (
<>
  <header> Pokédex </header>

  <ul className="appgrid">

    <Search />

    {/* {console.log(data.pokemons.results.sort((a, b) => a.name.localeCompare(b.name)))} */}
    {/* sort((a:any,b:any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)) */}

    <li className="searchbar"> Filter</li>
    <li className={sort ? "sortactive" : "searchbar"} onClick={() => setSort(!sort)}> {sort ? (<div> Sort by Name <br/> Sort by Type </div>) : "Sort"} </li>
    <li className="searchbar" onClick={() => setFavourite(!favourite)}> Favourites</li>
      {
        placeholder.sort( (a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name)).map((x:any, index:number) => { 
         return (
         <li className="gridchild" key={index}>
           <div className="boxcontent">
            <div className="pokemonname">{x.name}</div>
            <img src={x.artwork} alt="Pokemon" />
            {console.log("Compare", storage.filter((obj: { id: any; }) => obj.id === x.id))}
            {(storage.filter((obj: { id: any; }) => obj.id === x.id)).length ? 
            <img src={heart} className={"like"} onClick={() => {triggerLike(x, heart)}} alt="Like"/>
            : 
            <img src={noheart} className={"like"} onClick={() => {triggerLike(x)}} alt="No Like"/>
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
