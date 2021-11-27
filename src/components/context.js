import React, { useState } from "react";
import { maskConstants } from "./MaskSelector/constants.js";
import { lineConstants } from "./LineMaskSelector/constants.js";

const Context = React.createContext();

function Provider(props) {
  const [settings, setSettings] = useState({
    lowerBound: maskConstants["B"]["lowerBound"],
    upperBound: maskConstants["B"]["upperBound"],
    lineLowerBound: lineConstants["LINELOWERBOUND"],
    width: 6,
    autoWidth: true,
    autoMask: false,
    autoLineMask: true,
  });

  const [zipImgList, setZipImgList] = useState([]);

  return (
    <Context.Provider
      value={{
        settings: settings,
        setSettings: setSettings,
        zipImgList: zipImgList,
        setZipImgList: setZipImgList,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export { Context, Provider };
