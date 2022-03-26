import React, { useEffect, useState } from 'react';
import './App.scss';
import { gql, useQuery } from '@apollo/client';
import Search from './components/Search';
import heart from './assets/heart.png'
import noheart from './assets/noheart.png'
// import { BrowserRouter, Route, Switch } from 'react-router-dom';



function App() {

const [sort, setSort] = useState<boolean>(false)
const [favourite, setFavourite] = useState<boolean>(false)
const [storage, setStorage] = useState<any>([])
const [search, setSearch] = useState<boolean>(false)
const [searchResults, setSearchResults] = useState<any>([])
const [loadingSearch, setLoadingSearch] = useState<boolean>(false)
const [onMouseOver, setOnMouseOver] = useState<boolean>(false);
const [generation] = useState<any>([
    {
      id: 1,
      range: {from: 0, to: 151}
    },
    {
      id: 2,
      range: {from: 152, to: 251}
    },
    {
      id: 3,
      range: {from: 252, to: 386}
    },
    {
      id: 4,
      range: {from: 387, to: 493}
    },
    {
      id: 5,
      range: {from: 494, to: 649}
    },
    {
      id: 6,
      range: {from: 650, to: 721}
    },
    {
      id: 7,
      range: {from: 722, to: 809}
    },
    {
      id: 8,
      range: {from: 810, to: 905}
    },
  ]);

  const [selected, setSelected] = useState<any>([])

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


  const triggerLike = (y:any, heart?:any):void => {
    if (!heart)  {
    setStorage([...storage, y])
    } else {
    setStorage(storage.filter((obj: { id: any; }) => obj.id !== y.id))
    }
  }

  const { loading, error, data } = useQuery(GET_POKEMON, {variables: {limit: 300}} );
  // (error ? (console.log(`Error! ${error.message}`)) : null)

  let newPokemon:any = null
  if (data) {newPokemon = [...data.pokemons.results]}

  let placeholder:any
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
console.log("selected", selected)

  const onChange = (id:any) => {
    let find = selected.indexOf(id)

    if(find > -1) {
      selected.splice(find, 1)
    } else {
      selected.push(id)
    }
    setSelected(selected)
  }

  
  let finalarray:any = []


  // const dataJuggle = () => {

    // console.log("DataJugglestarts", placeholder)
    // let yolo2:any = 0
    // selected.map((number:any) => 
    //     yolo2 = placeholder.filter((poke:any) => poke.id === number.id,
    //     console.log("Yolo2", yolo2)) )}

    //  placeholder = generation.map((gen:any) => {
    //   let pancake = sorted.filter((item: { id:number; }) => {item.id  > gen.range.from && item.id < gen.range.to; console.log("Object names when sorting", item.id, gen.range.from, gen.range.to);});
    //   finalarray.push(pancake); 
    //   console.log("the new array the new array", finalarray)
    //   console.log("Was passiert im pancake?", pancake)
    //   })
    //   console.log("DataJuggle has filtered", placeholder)

      
// useEffect(():void => {
//   dataJuggle()
// }, [loading]);

  return (
    <div className="app">
  {loading || loadingSearch ? 'Loading...' : (
<>
  <header> Pokédex </header>

  <ul className="appgrid">

    <Search handleSearch={handleSearch} />

    <li className={"searchbar"} id={(onMouseOver || selected.length ? "filter" : "")} onMouseEnter={() => setOnMouseOver(true)} onMouseLeave={() => setOnMouseOver(false)}> 
          <div className={"filterheader"}>Generation</div>
          {onMouseOver || selected.length ? 
          <>
          <div className='checkdiv'>

          {generation.map((item:any) => {
          return (
          <label key={item.id}>{item.id}
          <input type="checkbox" id="check"
            onChange={() => onChange(item.id)}
            selected={selected.includes(item.id)}
          ></input>
          
          </label>
          )})}
          </div>
          </>
          
          : <></> }
          
    </li>


    <li className={"searchbar"} onClick={() => setSort(!sort)}> {sort ? "Sort from Z-A" : "Sort from A-Z"} </li>
    <li className={"searchbar"} id={favourite ? "searchbar-clicked" : undefined} onClick={() => setFavourite(!favourite)}> Favourites</li>
  
      {
        placeholder.sort((a: { name: string; }, b: { name: string; }) => sort ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name))
        // .filter(poke => poke.id === 63)
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

