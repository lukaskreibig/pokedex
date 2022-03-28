import '../App.scss';

type Props = {
    handleSort: () => void;
    sort: boolean;
  };

const Favourite: React.FC<Props> = ({handleSort, sort}) => {
    return (
        <li className={"searchbar"} onClick={() => handleSort()}>
        {sort ? "Sort from Z-A" : "Sort from A-Z"}
        </li>
    )}

export default Favourite;


