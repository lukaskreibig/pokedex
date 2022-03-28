import React from 'react';
import '../App.scss';

type Props = {
    handleSort: () => void;
    sort: boolean;
  };

// eslint-disable-next-line react/prop-types
const Favourite: React.FC<Props> = ({handleSort, sort}) => {
    return (
        <li className={"searchbar"} onClick={() => handleSort()}>
        {sort ? "Sort from Z-A" : "Sort from A-Z"}
        </li>
    )}

export default Favourite;


