import React, { useContext, useState } from "react";
import TextField from "@material-ui/core/TextField";
import styles from "./style.js";
import Button from "@material-ui/core/Button";

import maskAImg from "./assets/maskAImg.JPG";
import maskBImg from "./assets/maskBImg.JPG";
import maskCImg from "./assets/maskCImg.JPG";
import maskDImg from "./assets/maskDImg.JPG";
import maskEImg from "./assets/maskEImg.JPG";

import { maskConstants } from "../../../../constants.js";

const MaskSelector = (props) => {
  const {
    lowerMaskOne,
    setLowerMaskOne,
    lowerMaskTwo,
    setLowerMaskTwo,
    upperMaskOne,
    setUpperMaskOne,
    upperMaskTwo,
    setUpperMaskTwo,
    setMask,
    isManualMask,
    setIsManualMask,
  } = React.useContext(Context);

  const placeholder = "hue, sat, val";

  const modifyLowerSat = (val, masks) => {
    let newLowerMaskOne = [...lowerMaskOne];
    let newLowerMaskTwo = [...lowerMaskTwo];
    newLowerMaskOne[1] += val;
    newLowerMaskTwo[1] += val;

    if (newLowerMaskOne[1] > 255) {
      newLowerMaskOne[1] = 255;
    }
    if (newLowerMaskTwo[1] > 255) {
      newLowerMaskTwo[1] = 255;
    }
    if (
      newLowerMaskOne[1] > upperMaskOne[1] ||
      newLowerMaskTwo[1] > upperMaskTwo[1]
    ) {
      alert("Cannot increase lower sat above upper sat");
    } else {
      setLowerMaskOne(newLowerMaskOne);
      setLowerMaskTwo(newLowerMaskTwo);
    }
  };
  const modifyUpperSat = (val) => {
    let newUpperMaskOne = [...upperMaskOne];
    let newUpperMaskTwo = [...upperMaskTwo];
    newUpperMaskOne[1] += val;
    newUpperMaskTwo[1] += val;

    if (newUpperMaskOne[1] > 255) {
      newUpperMaskOne[1] = 255;
    }
    if (newUpperMaskTwo[1] > 255) {
      newUpperMaskTwo[1] = 255;
    }
    if (
      newUpperMaskOne[1] < lowerMaskOne[1] ||
      newUpperMaskTwo[1] < lowerMaskTwo[1]
    ) {
      alert("Cannot lower upper sat below lower sat");
    } else {
      setUpperMaskOne(newUpperMaskOne);
      setUpperMaskTwo(newUpperMaskTwo);
    }
  };

  const modifyLowerVal = (val) => {
    let newLowerMaskOne = [...lowerMaskOne];
    let newLowerMaskTwo = [...lowerMaskTwo];
    newLowerMaskOne[2] += val;
    newLowerMaskTwo[2] += val;

    if (newLowerMaskOne[2] > 255) {
      newLowerMaskOne[2] = 255;
    }
    if (newLowerMaskTwo[2] > 255) {
      newLowerMaskTwo[2] = 255;
    }
    if (
      newLowerMaskOne[2] > upperMaskOne[2] ||
      newLowerMaskTwo[2] > upperMaskTwo[2]
    ) {
      alert("Cannot increase lower val above upper val");
    } else {
      setLowerMaskOne(newLowerMaskOne);
      setLowerMaskTwo(newLowerMaskTwo);
    }
  };
  const modifyUpperVal = (val) => {
    let newUpperMaskOne = [...upperMaskOne];
    let newUpperMaskTwo = [...upperMaskTwo];
    newUpperMaskOne[2] += val;
    newUpperMaskTwo[2] += val;

    if (newUpperMaskOne[2] > 255) {
      newUpperMaskOne[2] = 255;
    }
    if (newUpperMaskTwo[2] > 255) {
      newUpperMaskTwo[2] = 255;
    }
    if (
      newUpperMaskOne[2] < lowerMaskOne[2] ||
      newUpperMaskTwo[2] < lowerMaskTwo[2]
    ) {
      alert("Cannot lower upper val below lower val");
    } else {
      setUpperMaskOne(newUpperMaskOne);
      setUpperMaskTwo(newUpperMaskTwo);
    }
  };

  const modifyHueRange = (val) => {
    let newLowerMaskTwo = [...lowerMaskTwo];
    let newUpperMaskOne = [...upperMaskOne];

    newLowerMaskTwo[0] -= val;
    newUpperMaskOne[0] += val;

    if (newLowerMaskTwo[0] < 0) {
      newLowerMaskTwo[0] = 0;
    }
    if (newUpperMaskOne[0] > 180) {
      newUpperMaskOne[0] = 180;
    }

    setLowerMaskTwo(newLowerMaskTwo);
    setUpperMaskOne(newUpperMaskOne);
  };

  const handleLowerMaskOneChange = (event) => {
    setLowerMaskOne(event.target.value);
  };

  const handleLowerMaskTwoChange = (event) => {
    setLowerMaskTwo(event.target.value);
  };

  const handleUpperMaskOneChange = (event) => {
    setUpperMaskOne(event.target.value);
  };

  const handleUpperMaskTwoChange = (event) => {
    setUpperMaskTwo(event.target.value);
  };

  return (
    <div style={styles.column}>
      <div style={{ height: 20 }} />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsManualMask(!isManualMask)}
      >
        Change mask type
      </Button>
      {isManualMask ? (
        <div>
          <h4>Selecting mask manually</h4>
          <div style={styles.row}>
            <div style={styles.column}>
              <div style={styles.row}>
                <TextField
                  label="HSV Lower Range 1"
                  style={styles.textField}
                  value={lowerMaskOne}
                  placeholder={placeholder}
                  onChange={handleLowerMaskOneChange}
                  margin="normal"
                />
                <TextField
                  label="HSV Lower Range 2"
                  style={styles.textField}
                  value={lowerMaskTwo}
                  placeholder={placeholder}
                  onChange={handleLowerMaskTwoChange}
                  margin="normal"
                />
              </div>
              <div style={styles.row}>
                <TextField
                  label="HSV Upper Range 1"
                  style={styles.textField}
                  value={upperMaskOne}
                  placeholder={placeholder}
                  onChange={handleUpperMaskOneChange}
                  margin="normal"
                />
                <TextField
                  label="HSV Upper Range 2"
                  style={styles.textField}
                  value={upperMaskTwo}
                  placeholder={placeholder}
                  onChange={handleUpperMaskTwoChange}
                  margin="normal"
                />
              </div>
            </div>

            <div style={styles.column}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setMask(maskConstants["A"])}
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
                onClick={() => setMask(maskConstants["B"])}
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
                onClick={() => setMask(maskConstants["C"])}
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
                onClick={() => setMask(maskConstants["D"])}
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
                onClick={() => setMask(maskConstants["E"])}
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
