import React, { useEffect, useState } from "react";
import "./App.scss";
import { gql, useQuery } from "@apollo/client";
import Search from "./components/Search";
import heart from "./assets/heart.png";
import noheart from "./assets/noheart.png";
import Generation from "./components/Generation";
import Favourite from "./components/Favourite";
import Pagination from "./components/Pagination";
import { IGen, IStorage } from "./interfaces";
import Sort from "./components/Sort";
import { generationList } from "./components/GenerationList";

type Props = {
  favourite?: boolean;
};

const App: React.FC<Props> = (Props) => {
  // Different Filter
  const [sort, setSort] = useState<boolean>(false);
  const [filter, setFilter] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<IStorage[]>();
  const [selected] = useState<Array<number>>([]);

  // Favourites
  const [favourite, setFavourite] = useState<boolean>(false);
  const [storage, setStorage] = useState<IStorage[]>([]);

  // Search
  const [search, setSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<IStorage[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(16);

  // Get All Pokemons from API GraphQL definition
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

  // Run GraphQL Query
  const { loading, data } = useQuery(GET_POKEMON, {
    variables: { limit: 905 },
  });

  // Store API Data
  let newPokemon: IStorage[] | undefined;
  if (data) {
    newPokemon = [...data.pokemons.results];
  }

  // Handle Filter States from Components
  const handleFavourite = (): void => {
    setFavourite(!favourite);
    setCurrentPage(1);
  };

  // Handle Sorting
  const handleSort = (): void => {
    setSort(!sort);
  };

  // Handle Like Mechanics for onClick
  const triggerLike = (y: IStorage, heart?: string): void => {
    if (!heart) {
      setStorage([...storage, y]);
    } else {
      setStorage(storage.filter((obj) => obj.id !== y.id));
    }
  };

  // Get Favourites from Local Storage
   
  useEffect((): void => {
    
     if (storage.length) {
      const storage = JSON.parse(localStorage.getItem("storage") || "");
      setStorage(storage);
    }
  }, [])

  // Save Favourites in Local Storage
  useEffect(
    (): void => localStorage.setItem("storage", JSON.stringify(storage)),
    [storage]
  );

  console.log(storage)

  useEffect((): void => {
    dataJuggle();
  }, [favourite]);

  // Handle Pokemon Data Flow for Return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let placeholder: any;
  favourite || Props.favourite
    ? (placeholder = storage)
    : search && searchResults
    ? (placeholder = searchResults)
    : (placeholder = newPokemon);

  // Handle Search
  const handleSearch = (results: IStorage[]): void => {
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
        },
      ]);
    }
    setSearch(true);
  };

  // Handle Pokemon Generation Filter Mechanic
  const dataJuggle = (): void => {
    if (selected.length) {
      let results: IStorage[];
      results = selected.map((filter: number) =>
        (favourite || Props.favourite
          ? (placeholder = storage)
          : placeholder
        ).filter(
          (poke: IGen) =>
            poke.id > generationList[filter - 1].range.from &&
            poke.id < generationList[filter - 1].range.to
        )
      );
      const newresults = results.flat(2);
      results = newresults;
      setFilterData(results);
      console.log("Results", results);
      setCurrentPage(1);
      setFilter(true);
    } else {
      setFilter(false);
    }
  };

  // Handle Generation Filter Checkboxes
  const onChange = (id: IGen["id"]) => {
    const find = selected.indexOf(id);

    if (find > -1) {
      selected.splice(find, 1);
    } else {
      selected.push(id);
    }
    dataJuggle();
  };

  // Handle Pagination Mechanic & Sort Data from A-Z or Z-A
  let currentPosts;
  const paginate = (paginateNumber: number) => {
    setCurrentPage(paginateNumber);
  };
  if (!loading) {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    currentPosts = (filter ? filterData : placeholder)
      .sort((a: IStorage, b: IStorage) =>
        sort ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      )
      .slice(indexOfFirstPost, indexOfLastPost);
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

            <Generation
              generation={generationList}
              selected={selected}
              onChange={onChange}
            />

            <Sort handleSort={handleSort} sort={sort} />

            <Favourite
              handleFavourite={() => handleFavourite()}
              favourite={favourite}
            />

            {currentPosts.map((x: IStorage, index: number) => {
              return (
                <li className="gridchild" key={index}>
                  <div className="boxcontent">
                    <div className="pokemonname">{x.name}</div>
                    <img
                      src={x.artwork ? x.artwork : x.sprites?.front_default}
                      alt="Pokemon"
                    />
                    {storage.filter((obj) => obj.id === x.id).length ? (
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

          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={filter ? filterData?.length : placeholder.length}
            paginate={paginate}
          />
        </>
      )}
    </div>
  );
};

export default App;
