import React, { useState } from "react";
import { maskConstants, base_url } from "../../constants.js";

const Context = React.createContext();

const Provider = (props) => {
  const [mask, setMask] = useState({
    lowerMaskOne: maskConstants["B"]["lower_range"][0],
    lowerMaskTwo: maskConstants["B"]["lower_range"][1],
    upperMaskOne: maskConstants["B"]["upper_range"][0],
    upperMaskTwo: maskConstants["B"]["upper_range"][1],
    width: 6,
    auto: True,
  });

  const [currentImage, setCurrentImage] = useState();
  const [currentImages, setCurrentImages] = useState();
  const [originalImage, setOriginalImage] = useState();

  const [zipImgList, setZipImgList] = useState([]);

  const analyzeImage = async () => {
    if (currentImage && imageWidth) {
      const url = base_url + "/measure";
      const form = new FormData();
      form.append("base64", originalImage);
      form.append("width", width);
      form.append("manual_width", width);
      form.append("lower_mask_one", mask["lowerMaskOne"]);
      form.append("lower_mask_two", mask["lowerMaskTwo"]);
      form.append("upper_mask_one", mask["upperMaskOne"]);
      form.append("upper_mask_two", mask["upperMaskTwo"]);
      form.append("manual_mask", !auto);

      const config = {
        method: "POST",
        body: form,
      };
      fetch(url, config)
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((matrix) => {
          if (matrix[1][1]["error"] == false) {
            setCurrentImage(matrix[1][1]["drawn_image"]);
            setOriginalImage(matrix[1][1]["orig"]);
            setEdgedImage(matrix[1][1]["edged_image"]);
            setCurrentImages(matrix);
            setAreas(matrix[1][1]["areas"]);
            setAnalyzed(true);
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

  const reanalyzeImage = async (obj) => {
    setMask(obj);
    analyzeImage();
  };

  const completeCrop = (image) => {
    setUseCrop(false);
    setCurrentImage(image);
    setOriginalImage(image);
  };

  return (
    <Context.Provider
      value={{
        zipImgList: zipImgList,
        setZipImgList: setZipImgList,

        setMask: setMask,
        isManualMask: isManualMask,
        setIsManualMask: setIsManualMask,

        setCurrentImage: setCurrentImage,
        setOriginalImage: setOriginalImage,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export { Context, Provider };
