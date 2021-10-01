import React, { useState } from "react";

import { Button, Checkbox, Tooltip, TextField } from "@material-ui/core";

import styles from "./style.js";

import MaskSelector from "../../../../components/MaskSelector/index.js";

const MultiAnalysisView = (props) => {
  const [imageWidth, setImageWidth] = useState(2.54);
  const [manualWidth, setManualWidth] = useState(false);

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
          {props.zipImgList.map((obj, i) => (
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
};

export default MultiAnalysisView;
