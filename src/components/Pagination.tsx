import "../App.scss";
import React from "react";

type Props = {
  totalPosts: number;
  postsPerPage: number;
  paginate: (number: number) => void;
};

const Pagination: React.FC<Props> = ({
  postsPerPage,
  totalPosts,
  paginate,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return pageNumbers.length >= 2 ? (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            onClick={() => paginate(number)}
            className="paginationNumber"
          >
            {number}
          </li>
        ))}
      </ul>
    </nav>
  ) : (null)
};

export default Pagination;
