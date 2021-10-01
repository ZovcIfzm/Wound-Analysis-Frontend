import React, { useEffect, useState } from "react";
import Cropper from "../../../components/ImageCropper/imageCropper";

import { Button, Checkbox, Tooltip, TextField } from "@material-ui/core";

import styles from "./style.js";

import { base_url } from "../../../constants.js";

import { Context } from "../../../components/context";

import MultiAnalysisView from "./views/MultiAnalysisView";

const SingleAnalysisPage = (props) => {
  const {
    lowerMaskOne,
    setLowerMaskOne,
    lowerMaskTwo,
    setLowerMaskTwo,
    upperMaskOne,
    setUpperMaskOne,
    upperMaskTwo,
    setUpperMaskTwo,
    setMask,
    zipImgList,
    setZipImgList,
    isManualMask,
    setIsManualMask,
  } = React.useContext(Context);

  const [analyzed, setAnalyzed] = useState(false);
  const [useCrop, setUseCrop] = useState(false);
  const [areas, setAreas] = useState([]);
  const [obj, setObj] = useState();
  const [jumpHeading, setJumpHeading] = useState();

  useEffect(() => {
    if (props.location.state != null) {
      const inState = props.location.state;
      const obj = props.location.state.obj;
      if (obj != null) {
        if (obj["drawn_image"]) {
          setCurrentImage(obj["drawn_image"]);
        } else {
          setCurrentImage(obj["orig"]);
        }
        setOriginalImage(obj["orig"]);
        setJumpHeading(obj["id"]);
      }
      setZipImgList(inState.zipImgList);
    }
  }, []);

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const onImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      let imgFile = event.target.files[0];
      getBase64(imgFile, (result) => {
        setCurrentImage(result);
        setOriginalImage(result);
      });
    }
  };

  const reanalyzeImage = async (obj) => {
    setIsManualMask(true);
    setLowerMaskOne(obj["lower_range"][0]);
    setLowerMaskTwo(obj["lower_range"][1]);
    setUpperMaskOne(obj["upper_range"][0]);
    setUpperMaskTwo(obj["upper_range"][1]);
    analyzeImage(
      obj["lower_range"][0],
      obj["lower_range"][1],
      obj["upper_range"][0],
      obj["upper_range"][1],
      true
    );
  };

  const analyzeImage = async (
    lowerMaskOne,
    lowerMaskTwo,
    upperMaskOne,
    upperMaskTwo,
    specifiedManualMask = false,
    isManualMask
  ) => {
    if (currentImage && imageWidth) {
      const url = base_url + "/measure";
      //const url = "/measure"
      const form = new FormData();
      form.append("base64", originalImage);
      form.append("width", imageWidth);
      form.append("manual_width", manualWidth);
      form.append("lower_mask_one", lowerMaskOne);
      form.append("lower_mask_two", lowerMaskTwo);
      form.append("upper_mask_one", upperMaskOne);
      form.append("upper_mask_two", upperMaskTwo);
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

  return (
    <SingleAnalysisView
      analyzeImage={analyzeImage}
      reanalyzeImage={reanalyzeImage}
      onImageUpload={onImageUpload}
      completeCrop={completeCrop}
      getBase64={getBase64}
      goToHome={goToHome}
      goToMulti={goToMulti}
      imageWidth={imageWidth}
      manualWidth={manualWidth}
      isManualWidth={isManualWidth}
      handleWidthChange={handleWidthChange}
      handleCropChange={handleCropChange}
      originalImage={originalImage}
      currentImages={currentImages}
      currentImage={currentImage}
      history={props.history}
      lowerMaskOne={props.lowerMaskOne}
      lowerMaskTwo={props.lowerMaskTwo}
      upperMaskOne={props.upperMaskOne}
      upperMaskTwo={props.upperMaskTwo}
    />
  );
};

export default SingleAnalysisPage;
