import React, { useState } from "react";
import { maskConstants } from "./MaskSelector/constants.js";

const Context = React.createContext();

function Provider(props) {
  const [settings, setSettings] = useState({
    lowerBound: maskConstants["B"]["lowerBound"],
    upperBound: maskConstants["B"]["upperBound"],
    width: 6,
    autoWidth: true,
    autoMask: false,
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
