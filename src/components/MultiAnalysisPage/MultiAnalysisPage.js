import React, { useContext, useEffect, useState } from "react";

import { Button, Checkbox, Tooltip, TextField } from "@material-ui/core";

import styles from "./style.js";

import MaskSelector from "../MaskSelector/index.js";

import { base_url, base_ml_url } from "../../constants.js";

import { Context } from "../context";

function MultiAnalysisPage(props) {
  const {
    lowerMaskOne,
    lowerMaskTwo,
    upperMaskOne,
    upperMaskTwo,
    zipImgList,
    setZipImgList,
    isManualMask,
  } = React.useContext(Context);
  const [imageWidth, setImageWidth] = useState(6);
  const [manualWidth, setManualWidth] = useState(false);

  useEffect(() => {
    let url = base_url;
    let ml_url = base_ml_url;
    //const url = "/"
    let form = new FormData();
    form.append("wakeup", "wakeup server");
    let analyze_options = {
      method: "POST",
      body: form,
    };
    fetch(url, analyze_options)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .catch((error) => console.log(error));

    fetch(ml_url, analyze_options)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .catch((error) => console.log(error));
  });

  const uploadDayZip = async (event) => {
    let zipFile = event.target.files[0];
    if (zipFile) {
      let url = base_url + "/zipMeasure";
      //let url = "/zipMeasure"
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

  const goToSingle = () => {
    props.history.push("/single");
  };

  const goToHome = () => {
    props.history.push("/home");
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
    <div style={{ ...styles.main, ...styles.mainRaised }}>
      <div style={styles.container}>
        <div style={styles.row}>
          <Button
            style={styles.cropButton}
            variant="contained"
            color="primary"
            onClick={goToHome}
          >
            Go to home page
          </Button>
          <Button
            style={styles.cropButton}
            variant="contained"
            color="primary"
            onClick={goToSingle}
          >
            Go to single-image measurement
          </Button>
        </div>
        <div style={styles.column}>
          <div style={styles.title}>
            <h2>Automatic Wound Area Measurement</h2>
            <h4>Multi-image measurement</h4>
          </div>
        </div>
        <div style={styles.column}>
          <div style={{ height: 20 }} />
          <Tooltip
            title="This is the length of the green line"
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
        </div>
        <div style={styles.column}>
          <MaskSelector />
        </div>
        <div style={styles.column}>
          <Button
            variant="contained"
            component="label"
            color="primary"
            style={styles.analyzeButton}
          >
            Upload and analyze ZIP file
            <input type="file" name="myImage" hidden onChange={uploadDayZip} />
          </Button>
        </div>
        <div style={styles.column}>
          {zipImgList.map((obj, i) => (
            <div key={i} id={"zipImg" + i}>
              {obj["error"] === false ? (
                <div style={styles.row}>
                  <img
                    src={obj["drawn_image"]}
                    style={styles.colImage}
                    alt=""
                    onClick={() => reanalyzeImage(obj, i)}
                  />
                  <div style={styles.column}>
                    <h3>Image: {i}</h3>
                    <h3>Areas</h3>
                    {obj["areas"].map((area) => (
                      <h5>{area}cm^2</h5>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={styles.row}>
                  <img
                    src={obj["orig"]}
                    style={styles.colImage}
                    alt=""
                    onClick={() => reanalyzeImage(obj, i)}
                  />
                  <p>Error: {obj["error_message"]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MultiAnalysisPage;
