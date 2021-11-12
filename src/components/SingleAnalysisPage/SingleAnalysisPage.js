import React, { useEffect, useState } from "react";
import Cropper from "../ImageCropper/imageCropper";

import { Button, Checkbox, Tooltip, TextField } from "@material-ui/core";

import styles from "./style.js";

import MaskSelector from "../MaskSelector/index.js";

import { base_url } from "../../constants.js";

import { Context } from "../context";

function SingleAnalysisPage(props) {
  const { mask, setMask, zipImgList, setZipImgList } =
    React.useContext(Context);
  const [currentImage, setCurrentImage] = useState();
  const [originalImage, setOriginalImage] = useState();
  const [currentImages, setCurrentImages] = useState();
  const [imageWidth, setImageWidth] = useState(6);
  const [useCrop, setUseCrop] = useState(false);
  const [areas, setAreas] = useState([]);
  const [manualWidth, setManualWidth] = useState(false);
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
  });

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

  const completeCrop = (image) => {
    setUseCrop(false);
    setCurrentImage(image);
    setOriginalImage(image);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let imgFile = event.target.files[0];
      getBase64(imgFile, (result) => {
        setCurrentImage(result);
        setOriginalImage(result);
      });
    }
  };

  const reanalyzeImage = async (obj) => {
    let maskObj = {
      ...mask,
      lowerBound: obj["lowerBound"],
      upperBound: obj["upperBound"],
      autoMask: false,
    };
    setMask(maskObj);
    analyzeImage(maskObj);
  };

  const analyzeImage = async (mask) => {
    if (currentImage && imageWidth) {
      const url = base_url + "/measure";
      //const url = "/measure"

      const form = new FormData();
      form.append("base64", originalImage);
      form.append("mask", mask);

      fetch(url, {
        method: "POST",
        body: form,
      })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((matrix) => {
          if (matrix[1][1]["error"] == false) {
            setCurrentImage(matrix[1][1]["drawn_image"]);
            setOriginalImage(matrix[1][1]["orig"]);
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

  const handleWidthChange = (event) => {
    setImageWidth(event.target.value);
  };

  const handleCropChange = () => {
    setUseCrop(true);
  };

  const changeManualWidth = () => {
    setMask((prevMask) => ({ ...prevMask, autoWidth: !prevMask["autoWidth"] }));
  };

  return (
    <div style={{ ...styles.main, ...styles.mainRaised }}>
      <div style={styles.container}>
        <div style={styles.row}>
          <Button
            style={styles.cropButton}
            variant="contained"
            color="primary"
            onClick={() => props.history.push("/home")}
          >
            Go to home page
          </Button>
          <Button
            style={styles.cropButton}
            variant="contained"
            color="primary"
            onClick={() => props.history.push("/multi")}
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
                  onChange={onImageChange}
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
                    onChange: handleWidthChange,
                  }}
                />
              </Tooltip>
              <div style={styles.row}>
                <Checkbox
                  checked={manualWidth}
                  onChange={() => changeManualWidth()}
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
                    onClick={handleCropChange}
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
              onClick={analyzeImage}
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
}

export default SingleAnalysisPage;
