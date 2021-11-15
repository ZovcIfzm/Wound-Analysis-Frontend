import React, { useEffect, useState } from "react";
import Cropper from "../ImageCropper/imageCropper";

import { Button, Checkbox, Tooltip, TextField } from "@material-ui/core";

import styles from "./style.js";

import MaskSelector from "../MaskSelector/index.js";
import NavBar from "../NavBar";

import { base_url } from "../../constants.js";

import { Context } from "../context";

function SingleAnalysisPage(props) {
  const { settings, setSettings } = React.useContext(Context);
  const [currentImage, setCurrentImage] = useState();
  const [originalImage, setOriginalImage] = useState();
  const [currentImages, setCurrentImages] = useState();
  const [useCrop, setUseCrop] = useState(false);
  const [areas, setAreas] = useState([]);
  const [jumpHeading, setJumpHeading] = useState();
  const [minDisplayWidth, setMinDisplayWidth] = useState(0.1);

  useEffect(() => {
    if (props.location.state != null) {
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
    let newSettings = {
      ...settings,
      lowerBound: obj["lowerBound"],
      upperBound: obj["upperBound"],
      autoMask: false,
    };
    setSettings(newSettings);
    analyzeImage(newSettings);
  };

  const analyzeImage = async () => {
    if (currentImage && settings.width) {
      const url = base_url + "/measure";

      const data = {
        base64: originalImage,
        settings: settings,
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } else if (currentImage && !settings.width) {
      alert("Please specify an image width");
    } else if (!currentImage && settings.width) {
      alert("Please upload an image");
    } else {
      alert("Please upload an image and specify it's real width");
    }
  };

  const handleWidthChange = (event) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      width: event.target.value,
    }));
  };

  const handleCropChange = () => {
    setUseCrop(true);
  };

  return (
    <div style={{ ...styles.main, ...styles.mainRaised }}>
      <div style={styles.container}>
        <div style={styles.title}>
          <h2>Automatic Wound Area Measurement</h2>
          <h4>Single-image measurement</h4>
        </div>
        <NavBar history={props.history} />
        <div style={styles.borderedContainer}>
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
                    defaultValue={settings.width}
                    InputProps={{
                      onChange: handleWidthChange,
                    }}
                  />
                </Tooltip>
                <div style={styles.row}>
                  <Checkbox
                    checked={!settings.autoWidth}
                    onChange={() =>
                      setSettings((prevSettings) => ({
                        ...prevSettings,
                        autoWidth: !prevSettings["autoWidth"],
                      }))
                    }
                    value="autoMask"
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
        </div>
        <MaskSelector />
        <div style={styles.borderedContainer}>
          <div style={styles.areasColumn}>
            <h2>Areas</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={analyzeImage}
              style={styles.thinButton}
            >
              Measure area
            </Button>
            <TextField
              id="standard-number"
              label="Minimum area displayed"
              defaultValue={minDisplayWidth}
              InputProps={{
                onChange: (event) => setMinDisplayWidth(event.target.value),
              }}
              style={styles.thinButton}
            />
            <h3>
              Current areas <br /> (left to right)
            </h3>
            {areas.map((value, i) =>
              parseFloat(value) > minDisplayWidth ? (
                <b key={i}>{value}cm^2</b>
              ) : null
            )}
          </div>
          <div style={styles.column}>
            {currentImages ? (
              <div style={styles.column}>
                <h1>Adjusted Masks</h1>
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
      </div>
    </div>
  );
}

export default SingleAnalysisPage;
