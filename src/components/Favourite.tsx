import '../App.scss';

type Props = {
    handleFavourite: () => void;
    favourite: boolean;
  };

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
