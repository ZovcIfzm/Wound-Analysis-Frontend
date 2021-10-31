import React, { useContext, useState } from "react";

import { base_url } from "../../../constants.js";

import { Context } from "../analysisContext";

import MultiAnalysisView from "../views/MultiAnalysisView";

const MultiAnalysisScreen = (props) => {
  const {
    lowerMaskOne,
    lowerMaskTwo,
    upperMaskOne,
    upperMaskTwo,
    zipImgList,
    setZipImgList,
    isManualMask,
    setIsManualMask,
  } = useContext(Context);

  const [imageWidth, setImageWidth] = useState(2.54);
  const [manualWidth, setManualWidth] = useState(false);

  const uploadZip = async (event) => {
    let zipFile = event.target.files[0];
    if (zipFile) {
      let url = base_url + "/zipMeasure";
      let form = new FormData();
      form.append("file", zipFile);
      form.append("width", imageWidth);
      form.append("manual_width", manualWidth);
      form.append("lower_mask_one", lowerMaskOne);
      form.append("lower_mask_two", lowerMaskTwo);
      form.append("upper_mask_one", upperMaskOne);
      form.append("upper_mask_two", upperMaskTwo);
      form.append("manual_mask", isManualMask);

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
        .then((imgList) => {
          alert("Images analyzed");
          setZipImgList(imgList);
        })
        .catch((error) => {
          if (error instanceof TypeError) {
            alert("Too many images, make a smaller Zip file");
          } else {
            console.log(error);
            alert("Unknown error, let Alex know about this. Error:", error);
          }
        });
    } else {
      alert("Please upload an zip file");
    }
  };

  const reanalyzeImage = async (obj, i) => {
    obj["id"] = i;
    props.history.push({
      pathname: "/single",
      state: { obj: obj },
    });
  };

  const handleWidthChange = (event) => {
    setImageWidth(event.target.value);
  };

  return (
    <MultiAnalysisView
      uploadZip={uploadZip}
      reanalyzeImage={reanalyzeImage}
      goToHome={goToHome}
      goToSingle={goToSingle}
      zipImgList={zipImgList}
    />
  );
};

export default MultiAnalysisScreen;
