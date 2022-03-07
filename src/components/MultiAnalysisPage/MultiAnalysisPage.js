import React, { useContext, useEffect, useState } from "react";

import { Button, Tooltip, TextField } from "@material-ui/core";
import JSZip from "jszip";
import styles from "./style.js";

import MaskSelector from "../MaskSelector/index.js";
import NavBar from "../NavBar";

import { base_url, base_ml_url } from "../../constants.js";

import { Context } from "../context";

function MultiAnalysisPage(props) {
  const { settings, setSettings, zipImgList, setZipImgList } =
    React.useContext(Context);

  const [minDisplayWidth, setMinDisplayWidth] = useState(0.1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    let url = base_url;
    let ml_url = base_ml_url;
    const data = {
      wakeup: "wakeupserver",
    };
    let analyze_options = {
      method: "POST",
      body: JSON.stringify(data),
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
  }, []);

  const uploadMultiple = async (event) => {
    setIsLoading(true);
    const zip = new JSZip();

    let files = event.target.files;
    if (files) {
      for (let file = 0; file < files.length; file++) {
        // Zip file with the file name.
        zip.file(files[file].name, files[file]);
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        let url = base_url + "/zipMeasure";

        const data = {
          zip: content,
          settings: settings,
        };

        let form = new FormData();
        form.append("file", content);
        form.append("settings", JSON.stringify(settings));

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
            setIsLoading(false);
            alert("Images analyzed");
            setZipImgList(imgList);
          })
          .catch((error) => {
            if (error instanceof TypeError) {
              setIsLoading(false);
              alert("Too many images, make a smaller Zip file");
            } else {
              setIsLoading(false);
              console.log(error);
              alert("Unknown error, let Alex know about this. Error:", error);
            }
          });
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
    setSettings((prevSettings) => ({
      ...prevSettings,
      width: event.target.value,
    }));
  };

  return (
    <div style={{ ...styles.main, ...styles.mainRaised }}>
      <div style={styles.container}>
        <div style={styles.title}>
          <h2>Automatic Wound Area Measurement</h2>
          <h4>Multi-image measurement</h4>
        </div>
        <NavBar history={props.history} />

        <MaskSelector />

        <div style={{ height: 20 }} />
        <Tooltip
          title="This is the length of the green line"
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
        <TextField
          id="standard-number"
          label="Minimum area displayed"
          defaultValue={minDisplayWidth}
          InputProps={{
            onChange: (event) => setMinDisplayWidth(event.target.value),
          }}
          style={styles.thinButton}
        />
        <div style={{ height: 20 }} />
        <Button
          variant="contained"
          component="label"
          color="primary"
          style={styles.analyzeButton}
        >
          {isLoading
            ? "Analyzing images..."
            : "Upload and analyze multiple files"}
          <input
            type="file"
            multiple
            name="myImage"
            hidden
            onChange={uploadMultiple}
          />
        </Button>
        <div style={{ height: 20 }} />
        <div style={styles.column}>
          {zipImgList.map((obj, i) => (
            <div key={i} id={"zipImg" + i}>
              {obj["error"] === false ? (
                <div style={styles.row}>
                  <div style={styles.imageColumn}>
                    <img
                      src={obj["drawn_image"]}
                      style={styles.colImage}
                      alt=""
                      onClick={() => reanalyzeImage(obj, i)}
                    />
                  </div>
                  <div style={styles.imageInfoColumn}>
                    <h3>Image: {i}</h3>
                    <h3>Areas</h3>
                    {obj["areas"].map((value, i) =>
                      parseFloat(value) > minDisplayWidth ? (
                        <b key={i}>{value}</b>
                      ) : null
                    )}
                  </div>
                </div>
              ) : (
                <div style={styles.row}>
                  <div style={styles.imageColumn}>
                    <img
                      src={obj["orig"]}
                      style={styles.colImage}
                      alt=""
                      onClick={() => reanalyzeImage(obj, i)}
                    />
                  </div>
                  <div style={styles.imageInfoColumn}>
                    Error: {obj["error_message"]}
                  </div>
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
