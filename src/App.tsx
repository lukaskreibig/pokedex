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
const [onMouseOver, setOnMouseOver] = useState<boolean>(false);
const [filter, setFilter] = useState<boolean>(false)
const [filterData, setFilterData] = useState<any>()
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

  useEffect(():void => 
      localStorage.setItem('storage', JSON.stringify(storage))
  , [storage]);

  useEffect(():void => {
    dataJuggle()}
    , [favourite]);

  const triggerLike = (y:any, heart?:any):void => {
    if (!heart)  {
    setStorage([...storage, y])
    } else {
    setStorage(storage.filter((obj: { id: any; }) => obj.id !== y.id))
    }
  }

  const { loading, error, data } = useQuery(GET_POKEMON, {variables: {limit: 905}} );

  let newPokemon:any
  if (data) {newPokemon = [...data.pokemons.results]}

  let placeholder:any
  favourite ? placeholder = storage : search && searchResults ? placeholder = searchResults : placeholder = newPokemon

  let handleSearch = (results:any):void => {
    if(results[0].id){
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
  }

  const dataJuggle = () => {

    if (selected.length) {

      let results:Array<string>
      results = (selected.map((filter:any) => (
      (favourite ? placeholder = storage : placeholder).filter((poke:any) => poke.id > generation[filter-1].range.from && poke.id < generation[filter-1].range.to)
      )))
      let newresults = results.flat(2);
      results = newresults

      setFilterData(results)
      setFilter(true)
      
    
    } else { setFilter(false)}
  }


  const onChange = (id:any) => {
    let find = selected.indexOf(id)

    if(find > -1) {
      selected.splice(find, 1)
    } else {
      selected.push(id)
    }
    dataJuggle()
  }



  return (
    <div className="app">
  {loading ? 'Loading...' : (
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
        (filter ? filterData : placeholder).sort((a: { name: string; }, b: { name: string; }) => sort ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name))
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