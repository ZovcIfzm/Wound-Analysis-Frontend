import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import maskAImg from "../../assets/maskAImg.JPG";
import maskBImg from "../../assets/maskBImg.JPG";
import maskCImg from "../../assets/maskCImg.JPG";
import maskDImg from "../../assets/maskDImg.JPG";
import maskEImg from "../../assets/maskEImg.JPG";

import { maskConstants } from "./constants.js";
import styles from "./style.js";

import { Context } from "../context";

const MaskSelector = (props) => {
  const { settings, setSettings } = React.useContext(Context);

  const placeholder = "hue, sat, val";

  const modifyLowerSat = (val) => {
    let newLowerBound = [...settings.lowerBound];
    newLowerBound[1] = Math.min(255, newLowerBound[1] + val);

    if (newLowerBound[1] > settings.upperBound[1]) {
      alert("Cannot increase lower sat above upper sat");
    } else {
      setSettings((prevSettings) => ({
        ...prevSettings,
        lowerBound: newLowerBound,
      }));
    }
  };

  const modifyLowerVal = (val) => {
    let newLowerBound = [...settings.lowerBound];
    newLowerBound[2] = Math.min(255, newLowerBound[2] + val);

    if (newLowerBound[2] > settings.upperBound[2]) {
      alert("Cannot increase lower val above upper val");
    } else {
      setSettings((prevSettings) => ({
        ...prevSettings,
        lowerBound: newLowerBound,
      }));
    }
  };
  const modifyUpperVal = (val) => {
    let newUpperBound = [...settings.upperBound];
    newUpperBound[2] = Math.min(255, newUpperBound[2] + val);

    if (newUpperBound[2] < settings.lowerBound[2]) {
      alert("Cannot lower upper val below lower val");
    } else {
      setSettings((prevSettings) => ({
        ...prevSettings,
        upperBound: newUpperBound,
      }));
    }
  };

  const modifyHueRange = (val) => {
    let newLowerBound = [...settings.lowerBound];
    let newUpperBound = [...settings.upperBound];

    newLowerBound[0] = Math.min(0, newLowerBound[0] - val);
    newUpperBound[0] = Math.max(0, newUpperBound[0] + val);

    setSettings((prevSettings) => ({
      ...prevSettings,
      lowerBound: newLowerBound,
      upperBound: newUpperBound,
    }));
  };

  const handleLowerBoundChange = (event) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      lowerBound: event.target.value,
    }));
  };

  const handleUpperBoundChange = (event) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      upperBound: event.target.value,
    }));
  };

  return (
    <div style={styles.column}>
      <div style={{ height: 20 }} />
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          setSettings((prevSettings) => ({
            ...prevSettings,
            autoMask: !prevSettings.autoMask,
          }))
        }
      >
        Change mask type
      </Button>
      {!settings.autoMask ? (
        <div style={styles.column}>
          <div style={styles.row}>
            <div style={styles.column}>
              <h4>Selecting mask manually</h4>
              <TextField
                label="HSV Lower Range"
                style={styles.textField}
                value={settings.lowerBound}
                placeholder={placeholder}
                onChange={handleLowerBoundChange}
                margin="normal"
              />
              <TextField
                label="HSV Upper Range"
                style={styles.textField}
                value={settings.upperBound}
                placeholder={placeholder}
                onChange={handleUpperBoundChange}
                margin="normal"
              />
            </div>
            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    ...maskConstants["A"],
                  }))
                }
              >
                Select Lightest Mask
              </Button>
              Best for:
              <img src={maskAImg} style={styles.exampleImage} alt="" />
            </div>
            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    ...maskConstants["B"],
                  }))
                }
              >
                Select Light Mask
              </Button>
              Best for:
              <img src={maskBImg} style={styles.exampleImage} alt="" />
            </div>
            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    ...maskConstants["C"],
                  }))
                }
              >
                Select Standard Mask
              </Button>
              Best for:
              <img src={maskCImg} style={styles.exampleImage} alt="" />
            </div>
            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    ...maskConstants["D"],
                  }))
                }
              >
                Select Darker Mask
              </Button>
              Best for:
              <img src={maskDImg} style={styles.exampleImage} alt="" />
            </div>
            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    ...maskConstants["E"],
                  }))
                }
              >
                Select Darkest Mask
              </Button>
              Best for:
              <img src={maskEImg} style={styles.exampleImage} alt="" />
            </div>
          </div>
          <div style={{ height: 10 }} />
          <div style={styles.row}>
            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "maroon" }}
                onClick={() => modifyLowerSat(5)}
                style={styles.hsvButton}
              >
                Look for redder wounds (+sat)
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "pink" }}
                onClick={() => modifyLowerSat(-5)}
                style={styles.hsvButton}
              >
                Look for pinker wounds (-sat)
              </Button>
            </div>
            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#800200" }}
                onClick={() => modifyLowerVal(5)}
                style={styles.hsvButton}
              >
                Look for brighter wounds (+val)
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "black" }}
                onClick={() => modifyLowerVal(-5)}
                style={styles.hsvButton}
              >
                Look for darker wounds (-val)
              </Button>
            </div>
            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "green" }}
                onClick={() => modifyUpperVal(5)}
                style={styles.hsvButton}
              >
                Include more skin (+upperVal)
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "green" }}
                onClick={() => modifyUpperVal(-5)}
                style={styles.hsvButton}
              >
                Include less skin (-upperVal)
              </Button>
            </div>
            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "green" }}
                onClick={() => modifyHueRange(5)}
                style={styles.hsvButton}
              >
                Include more wound colors (+hue range)
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "green" }}
                onClick={() => modifyHueRange(-5)}
                style={styles.hsvButton}
              >
                Reduce range of possible colors (-hue range)
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <h4>Selecting mask automatically</h4>
      )}
      <div style={{ height: 20 }} />
    </div>
  );
};

export default MaskSelector;
