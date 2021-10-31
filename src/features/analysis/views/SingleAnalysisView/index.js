import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Cropper from "../../components/ImageCropper/imageCropper";

import { Button, Checkbox, Tooltip, TextField } from "@material-ui/core";

import styles from "./style.js";

import MaskSelector from "../../components/MaskSelector";

const completeCrop = (image, setUseCrop, setCurrentImage, setOriginalImage) => {
  setUseCrop(false);
  setCurrentImage(image);
  setOriginalImage(image);
};

const onImageUpload = (files, setCurrentImage, setOriginalImage) => {
  if (files && files[0]) {
    let imgFile = files[0];
    let reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = function () {
      setCurrentImage(reader.result);
      setOriginalImage(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
};

const SingleAnalysisView = (props) => {
  const [analyzed, setAnalyzed] = useState(false);
  const [useCrop, setUseCrop] = useState(false);
  const [areas, setAreas] = useState([]);
  const [obj, setObj] = useState();
  const [jumpHeading, setJumpHeading] = useState();

  const { analyzeImage, reanalyzeImage, currentImage, setCurrentImage, originalImage, setOriginalImage } =
    React.useContext(Context);

  let history = useHistory();

  return (
    <div style={{ ...styles.main, ...styles.mainRaised }}>
      <div style={styles.container}>
        <div style={styles.row}>
          <Button
            style={styles.cropButton}
            variant="contained"
            color="primary"
            onClick={() => history.push("/home")}
          >
            Go to home page
          </Button>
          <Button
            style={styles.cropButton}
            variant="contained"
            color="primary"
            onClick={() => history.push("/multi")}
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
                  onChange={(event) =>
                    onImageUpload(
                      event.target.files,
                      setCurrentImage,
                      setOriginalImage
                    )
                  }
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
                    onChange: (event) =>
                      setMask((prevMask) => ({
                        ...prevMask,
                        width: event.target.value,
                      })),
                  }}
                />
              </Tooltip>
              <div style={styles.row}>
                <Checkbox
                  checked={}
                  onChange={() =>
                    setMask((prevMask) => ({ ...prevMask, auto: False }))
                  }
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
                completeCrop={completeCrop}
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
                    onClick={() => setUseCrop(true)}
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
                analyzeImage()
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
                    onClick={() => reanalyzeImage(obj)}
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
