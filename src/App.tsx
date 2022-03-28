import React, { useEffect, useState } from "react";
import "./App.scss";
import { gql, useQuery } from "@apollo/client";
import Search from "./components/Search";
import heart from "./assets/heart.png";
import noheart from "./assets/noheart.png";
import Generation from "./components/Generation";
import Favourite from "./components/Favourite";
import { IGen, IStorage } from "./interfaces";
import Sort from "./components/Sort";

const App:React.FC = () => {
  const [sort, setSort] = useState<boolean>(false);
  const [favourite, setFavourite] = useState<boolean>(false);
  const [storage, setStorage] = useState<IStorage[]>([]);
  const [search, setSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<IStorage[]>([]);
  const [filter, setFilter] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<IStorage[]>();
  const [selected] = useState<Array<number>>([]);

  
  const [generation] = useState<IGen[]>([
    {
      id: 1,
      range: { from: 0, to: 151 },
    },
    {
      id: 2,
      range: { from: 152, to: 251 },
    },
    {
      id: 3,
      range: { from: 252, to: 386 },
    },
    {
      id: 4,
      range: { from: 387, to: 493 },
    },
    {
      id: 5,
      range: { from: 494, to: 649 },
    },
    {
      id: 6,
      range: { from: 650, to: 721 },
    },
    {
      id: 7,
      range: { from: 722, to: 809 },
    },
    {
      id: 8,
      range: { from: 810, to: 905 },
    },
  ]);

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

  const { loading, data } = useQuery(GET_POKEMON, {
    variables: { limit: 905 },
  });

  let newPokemon: IStorage[] | undefined;
  if (data) {
    newPokemon = [...data.pokemons.results];
  }

  const handleFavourite = ():void => {
    setFavourite(!favourite)
  }

  const handleSort = ():void => {
    setSort(!sort)
  }

  useEffect((): void => {
    const storage = JSON.parse(localStorage.getItem("storage") || "");
    if (storage) {
      setStorage(storage);
    }
  }, []);

  useEffect(
    (): void => localStorage.setItem("storage", JSON.stringify(storage)),
    [storage]
  );

  useEffect((): void => {
    dataJuggle()
  }, [favourite]);

  const triggerLike = (y: any, heart?: any): void => {
    if (!heart) {
      setStorage([...storage, y]);
    } else {
      setStorage(storage.filter((obj) => obj.id !== y.id));
    }
  };

  let placeholder: any;
  favourite
    ? (placeholder = storage)
    : search && searchResults
    ? (placeholder = searchResults)
    : (placeholder = newPokemon);

  let handleSearch = (results:IStorage[]): void => {
    if (results[0].id) {
      setSearchResults(results);
    } else {
      setSearchResults([
        {
          name: "Nope. No Pokemon Found.",
          sprites: {
            front_default:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
          },
          notacard: true,
        }
      ]);
    }
    setSearch(true);
  };

  const dataJuggle = ():void => {
    if (selected.length) {
      let results: IStorage[];
      results = selected.map((filter: number) =>
        (favourite ? (placeholder = storage) : placeholder).filter(
          (poke: IGen) =>
            poke.id > generation[filter - 1].range.from &&
            poke.id < generation[filter - 1].range.to
        )
      );
      let newresults = results.flat(2);
      results = newresults;
      setFilterData(results);
      console.log("Results", results)
      setFilter(true);
    } else {
      setFilter(false);
    }
  };

  const onChange = (id:IGen["id"]) => {
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
      {loading ? (
        "Loading..."
      ) : (
        <>
          <header> Pokédex </header>

          <ul className="appgrid">
            <Search handleSearch={handleSearch} />

            <Generation generation={generation} selected={selected} onChange={onChange} />
            
            <Sort handleSort={handleSort} sort={sort} />

            <Favourite handleFavourite={() => handleFavourite()} favourite={favourite} />

            {(filter ? filterData : placeholder)
              .sort((a:IGen, b:IGen) =>
                sort
                  ? b.name.localeCompare(a.name)
                  : a.name.localeCompare(b.name)
              )
              .map((x: IGen, index: number) => {
                return (
                  <li className="gridchild" key={index}>
                    <div className="boxcontent">
                      <div className="pokemonname">{x.name}</div>
                      <img
                        src={x.artwork ? x.artwork : x.sprites.front_default}
                        alt="Pokemon"
                      />
                      {storage.filter((obj) => obj.id === x.id)
                        .length ? (
                        <img
                          src={heart}
                          className={"like"}
                          onClick={() => {
                            triggerLike(x, heart);
                          }}
                          alt="Like"
                        />
                      ) : !x.notacard ? (
                        <img
                          src={noheart}
                          className={"like"}
                          onClick={() => {
                            triggerLike(x);
                          }}
                          alt="No Like"
                        />
                      ) : null}
                    </div>
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
