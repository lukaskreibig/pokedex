import React from 'react';
import './App.css';
import { gql, useQuery } from '@apollo/client';

function App() {

  const GET_POKEMON = gql`
  query Query{
    allPokemon(limit: 30){
      id
      name
      height
      weight
      color
      base_stats {
        hp
        attack
        defense
        special_attack
        special_defense
        speed
      }
      evolves_from {name}
      evolves_to {name}
      sprites {front_default
              back_default
              
            }
      }}
`;

  const { loading, error, data } = useQuery(GET_POKEMON);


  return (
    <div className="App">
  {loading ? 'Loading...' : console.log(data)}
  {error ? console.log(`Error! ${error.message}`) : null}

    </div>
  );
}

export default App;
