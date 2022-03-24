import React from 'react';
import './App.scss';
import { gql, useQuery } from '@apollo/client';

function App() {

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
  {loading ? 'Loading...' : 
  <ul className="appgrid">
    {console.log(console.log(data.pokemons.results))}

      {
       data.pokemons.results.map((x:any, index:number) => { 
         return (
         <li className="gridchild" key={index}>
          <img src={x.image} alt="Pokemon" />
          {x.name}
         
         </li>

       )})
     }
  </ul>  
  }

  

    </div>
  );
}

export default App;
