import React, { useState } from "react";
import { maskConstants } from "./MaskSelector/constants.js";

const Context = React.createContext();

const Provider = (props) => {
  const [lowerMaskOne, setLowerMaskOne] = useState(
    maskConstants["B"]["lower_range"][0]
  );
  const [lowerMaskTwo, setLowerMaskTwo] = useState(
    maskConstants["B"]["lower_range"][1]
  );
  const [upperMaskOne, setUpperMaskOne] = useState(
    maskConstants["B"]["upper_range"][0]
  );
  const [upperMaskTwo, setUpperMaskTwo] = useState(
    maskConstants["B"]["upper_range"][1]
  );
  const [isManualMask, setIsManualMask] = useState(false);
  const [zipImgList, setZipImgList] = useState([]);
  const [currentImage, setCurrentImage] = useState();
  const [currentImages, setCurrentImages] = useState();
  const [originalImage, setOriginalImage] = useState();
  const [imageWidth, setImageWidth] = useState(2.54);
  const [manualWidth, setManualWidth] = useState(false);

  const setMask = async (mask) => {
    setIsManualMask(true);
    setLowerMaskOne(mask["lower_range"][0]);
    setLowerMaskTwo(mask["lower_range"][1]);
    setUpperMaskOne(mask["upper_range"][0]);
    setUpperMaskTwo(mask["upper_range"][1]);
  };

  const analyzeImage = async () => {
    if (currentImage && imageWidth) {
      const url = base_url + "/measure";
      //const url = "/measure"
      const form = new FormData();
      form.append("base64", originalImage);
      form.append("width", imageWidth);
      form.append("manual_width", manualWidth);
      form.append("lower_mask_one", mask["lower_range"][0]);
      form.append("lower_mask_two", mask["lower_range"][1]);
      form.append("upper_mask_one", mask["upper_range"][0]);
      form.append("upper_mask_two", mask["upper_range"][1]);
      if (specifiedManualMask) {
        form.append("manual_mask", specifiedManualMask);
      } else {
        form.append("manual_mask", isManualMask);
      }

      //Then analyze
      const analyze_options = {
        method: "POST",
        body: form,
      };
      fetch(url, analyze_options)
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((matrix) => {
          if (matrix[1][1]["error"] == false) {
            setAnalyzed(true);
            setCurrentImage(matrix[1][1]["drawn_image"]);
            setOriginalImage(matrix[1][1]["orig"]);
            setEdgedImage(matrix[1][1]["edged_image"]);
            setCurrentImages(matrix);
            setAreas(matrix[1][1]["areas"]);
            alert("Images analyzed");
          } else {
            alert(matrix[1][1]["error_message"]);
          }
        })
        .catch((error) => console.log(error));
    } else if (currentImage && !imageWidth) {
      alert("Please specify an image width");
    } else if (!currentImage && imageWidth) {
      alert("Please upload an image");
    } else {
      alert("Please upload an image and specify it's real width");
    }
  };

  const reanalyzeImage = async (obj, setMask) => {
    setMask(obj);
    analyzeImage(obj, true);
  };

  return (
    <Context.Provider
      value={{
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
        setIsManualMask,
        setIsManualMask,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export { Context, Provider };
