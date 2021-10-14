import React, { useState } from "react"
import { maskConstants } from "./MaskSelector/constants.js"

const Context = React.createContext()

function Provider(props) {
    const [lowerMaskOne, setLowerMaskOne] = useState(maskConstants["B"]["lower_range"][0])
    const [lowerMaskTwo, setLowerMaskTwo] = useState(maskConstants["B"]["lower_range"][1])
    const [upperMaskOne, setUpperMaskOne] = useState(maskConstants["B"]["upper_range"][0])
    const [upperMaskTwo, setUpperMaskTwo] = useState(maskConstants["B"]["upper_range"][1])
    const [isManualMask, setIsManualMask] = useState(false);
    const [zipImgList, setZipImgList] = useState([]);

    const setMask = async (mask) => {
        setLowerMaskOne(mask["lower_range"][0])
        setLowerMaskTwo(mask["lower_range"][1])
        setUpperMaskOne(mask["upper_range"][0])
        setUpperMaskTwo(mask["upper_range"][1])
    };

    return (
        <Context.Provider value={{ 
            lowerMaskOne: lowerMaskOne,
            setLowerMaskOne: setLowerMaskOne,
            lowerMaskTwo: lowerMaskTwo,
            setLowerMaskTwo: setLowerMaskTwo,
            upperMaskOne: upperMaskOne,
            setUpperMaskOne: setUpperMaskOne,
            upperMaskTwo: upperMaskTwo,
            setUpperMaskTwo: setUpperMaskTwo,
            zipImgList: zipImgList,
            setZipImgList: setZipImgList,
            setMask: setMask,
            isManualMask: isManualMask,
            setIsManualMask, setIsManualMask,
        }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context, Provider }