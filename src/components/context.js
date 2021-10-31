import React, { useState } from "react";
import { maskConstants } from "./MaskSelector/constants.js";

const Context = React.createContext();

function Provider(props) {
  const [mask, setMask] = useState({
    lowerBound: maskConstants["B"]["lowerBound"],
    upperBound: maskConstants["B"]["upperBound"],
    width: 6,
    autoWidth: True,
    autoMask: False,
  });

  const [zipImgList, setZipImgList] = useState([]);

  return (
    <Context.Provider
      value={{
        mask: mask,
        setMask: setMask,
        zipImgList: zipImgList,
        setZipImgList: setZipImgList,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export { Context, Provider };
