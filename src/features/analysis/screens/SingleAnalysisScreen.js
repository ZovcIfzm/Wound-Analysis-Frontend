import React, { useEffect, useState } from "react";

import { base_url } from "../../../constants.js";

import { Context } from "../../../components/context";

import SingleAnalysisView from "./views/SingleAnalysisView";

const onImageUpload = (event, getBase64, setCurrentImage, setOriginalImage) => {
  if (event.target.files && event.target.files[0]) {
    let imgFile = event.target.files[0];
    getBase64(imgFile, (result) => {
      setCurrentImage(result);
      setOriginalImage(result);
    });
  }
};

const SingleAnalysisScreen = (props) => {
  const {
    setLowerMaskOne,
    setLowerMaskTwo,
    setUpperMaskOne,
    setUpperMaskTwo,
    setMask,
    zipImgList,
    setZipImgList,
    isManualMask,
    setIsManualMask,
  } = React.useContext(Context);

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

export default SingleAnalysisScreen;
