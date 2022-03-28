import '../App.scss';
import React from 'react';

type Props = {
    handleFavourite: () => void;
    favourite?: boolean;
  };

// eslint-disable-next-line react/prop-types
const Favourite: React.FC<Props> = ({handleFavourite, favourite}) => {
    return (
    <li
        className={"searchbar"}
        id={favourite ? "searchbar-clicked" : undefined}
        onClick={() => handleFavourite()}
    >
        Favourites
    </li>
    )}

export default Favourite;
