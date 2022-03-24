import React, { useState } from 'react';
import './App.scss';
import { gql, useQuery } from '@apollo/client';



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

  const { loading, error, data } = useQuery(GET_POKEMON);
  console.log(error ? (console.log(`Error! ${error.message}`)) : null)

  return (
    <div className="app">
  {loading ? 'Loading...' : (
<>
  <header> Pokédex </header>

  <ul className="appgrid">
    {console.log(console.log(data.pokemons.results))}

    <li className="searchbar"> Search</li>
    <li className="searchbar"> Filter</li>
    <li className={sort ? "sortactive" : "searchbar"} onClick={() => setSort(!sort)}> {sort ? (<div> Sort by Name <br/> Sort by Type </div>) : "Sort"} </li>
    <li className="searchbar"> Favourites</li>



      {
       data.pokemons.results.map((x:any, index:number) => { 
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
