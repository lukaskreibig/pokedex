import React, { useEffect, useState } from 'react';
import './App.scss';
import { gql, useQuery } from '@apollo/client';
import Search from './components/Search';



function App() {

const [sort, setSort] = useState<boolean>(false)

console.log(sort)

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

  const { loading, error, data } = useQuery(GET_POKEMON, {variables: {limit: 1000}} );
  console.log(error ? (console.log(`Error! ${error.message}`)) : null)

  let newPokemon:any = null
  if (data) {newPokemon = [...data.pokemons.results]}

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
    <li className="searchbar"> Favourites</li>
      {
       newPokemon.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name)).map((x:any, index:number) => { 
         return (
         <li className="gridchild" key={index}>
           <div className="boxcontent">
            <div className="pokemonname">{x.name}</div>
            <img src={x.artwork} alt="Pokemon" />
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
