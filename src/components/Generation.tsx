import React, { useState } from "react";
import "../App.scss";
import { IGen } from "../interfaces";

type Props = {
  generation:IGen[];
  onChange: (id:IGen["id"]) => void;
  selected:number[]
};

const Generation: React.FC<Props> = ({selected, generation, onChange}) => {
  
  const [onMouseOver, setOnMouseOver] = useState<boolean>(false);
  
  return (
  <li
    className={"searchbar"}
    id={onMouseOver || selected.length ? "filter" : ""}
    onMouseEnter={() => setOnMouseOver(true)}
    onMouseLeave={() => setOnMouseOver(false)}
  >
    <div className={"filterheader"}>Generation</div>
    {onMouseOver || selected.length ? (
      <>
        <div className="checkdiv">
          {generation.map((item:IGen) => {
            return (
              <label key={item.id}>
                {item.id}
                <input
                  type="checkbox"
                  id="check"
                  onChange={() => onChange(item.id)}
                ></input>
              </label>
            );
          })}
        </div>
      </>
    ) : (
      <></>
    )}
  </li>
  )
};

export default Generation;
