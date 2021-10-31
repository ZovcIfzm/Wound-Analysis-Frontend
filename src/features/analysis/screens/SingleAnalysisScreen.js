import React, { useEffect, useState } from "react";

import { base_url } from "../../../constants.js";

import { Context } from "../analysisContext";

import SingleAnalysisView from "../views/SingleAnalysisView";

const SingleAnalysisScreen = (props) => {
  const { setMask, zipImgList, setZipImgList, isManualMask, setIsManualMask } =
    React.useContext(Context);

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

  return <SingleAnalysisView />;
};

export default SingleAnalysisScreen;
