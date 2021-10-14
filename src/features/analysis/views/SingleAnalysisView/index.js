import React, { useEffect, useState } from "react";
import Cropper from "../../../components/ImageCropper/imageCropper";

import { Button, Checkbox, Tooltip, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import styles from "./style.js";
import styles from "styles";

import MaskSelector from "../../../components/MaskSelector/index.js";
import DebugToolbar from "../../../components/DebugToolbar/index.js";

import { maskConstants } from "../../../components/MaskSelector/constants.js";
import { base_url } from "../../../constants.js";

import { Context } from "../../../components/context";

const completeCrop = (image, setUseCrop, setCurrentImage, setOriginalImage) => {
  setUseCrop(false);
  setCurrentImage(image);
  setOriginalImage(image);
};

const goToMulti = (history) => {
  if (zipImgList != null) {
    history.push({
      pathname: "/multi",
      state: { zipImgList: zipImgList },
    });
  } else {
    history.push("/multi");
  }
};

const goToHome = (history) => {
  history.push("/home");
};

const handleWidthChange = (event, setImageWidth) => {
  setImageWidth(event.target.value);
};

const handleCropChange = (setUseCrop) => {
  setUseCrop(true);
};

const isManualWidth = (setManualWidth) => {
  setManualWidth(!manualWidth);
};

const SingleAnalysisView = (props) => {
  const [useCrop, setUseCrop] = useState(false);
  const [areas, setAreas] = useState([]);
  const [jumpHeading, setJumpHeading] = useState();
  const [currentImage, setCurrentImage] = useState();
  const [currentImages, setCurrentImages] = useState();
  const [originalImage, setOriginalImage] = useState();
  const [imageWidth, setImageWidth] = useState(2.54);
  const [manualWidth, setManualWidth] = useState(false);

  return (
    <div style={{ ...styles.main, ...styles.mainRaised }}>
      <div style={styles.container}>
        <div style={styles.row}>
          <Button
            style={styles.cropButton}
            variant="contained"
            color="primary"
            onClick={() => goToHome(props.history)}
          >
            Go to home page
          </Button>
          <Button
            style={styles.cropButton}
            variant="contained"
            color="primary"
            onClick={() => goToMulti(props.history)}
          >
            Go to multi-image measurement
          </Button>
        </div>
        <div style={styles.title}>
          <h2>Automatic Wound Area Measurement</h2>
          <h4>Single-image measurement</h4>
        </div>
        <div style={styles.row}>
          <div style={styles.column}>
            <div style={styles.button} style={{ flex: 1 }}>
              <h3>Upload Image</h3>
              <Button variant="contained" component="label">
                Upload Image
                <input
                  type="file"
                  name="myImage"
                  hidden
                  onChange={props.onImageUpload}
                />
              </Button>
            </div>
            <div style={styles.column}>
              <div style={{ height: 40 }} />
              <Tooltip
                title="This is the length of the green line, if manual, this is the width of the image"
                placement="top-start"
              >
                <TextField
                  id="standard-number"
                  label="Enter reference width (cm)"
                  defaultValue={imageWidth}
                  InputProps={{
                    onChange: () => handleWidthChange(setImageWidth),
                  }}
                />
              </Tooltip>
              <div style={styles.row}>
                <Checkbox
                  checked={manualWidth}
                  onChange={() => isManualWidth(setManualWidth)}
                  value="manualWidth"
                />
                <div style={styles.centeredText}>Set width to manual</div>
              </div>
            </div>
          </div>

          <div style={styles.column}>
            {useCrop ? (
              <Cropper
                currentImage={originalImage}
                completeCrop={props.completeCrop}
              />
            ) : (
              <>
                <h3>Image {jumpHeading}</h3>
                <div style={styles.column}>
                  <img src={currentImage} style={styles.images} alt="" />
                  <Button
                    style={styles.cropButton}
                    variant="contained"
                    color="primary"
                    onClick={() => handleCropChange(setUseCrop)}
                  >
                    Crop Image
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <MaskSelector />
        <div style={styles.row}>
          <div style={styles.column}>
            <h3>Current areas:</h3>
            {areas.map((value, i) => (
              <b key={i}>{value}cm^2</b>
            ))}

            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                props.analyzeImage(
                  props.lowerMaskOne,
                  props.lowerMaskTwo,
                  props.upperMaskOne,
                  props.upperMaskTwo
                )
              }
              style={styles.cropButton}
            >
              Measure area
            </Button>
          </div>
        </div>
        {currentImages ? (
          <div style={styles.column}>
            <p>Stricter farther right (+sat) and down (+val)</p>
            {currentImages.map((row, i) => (
              <div key={i} style={styles.row}>
                {row.map((obj, i) => (
                  <img
                    key={i}
                    src={obj["drawn_image"]}
                    style={styles.gridImage}
                    alt=""
                    onClick={() => props.reanalyzeImage(obj)}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SingleAnalysisView;
