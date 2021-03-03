import React from "react";
import TextField from "@material-ui/core/TextField";
import style from "./style.js";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import maskAImg from "../../assets/maskAImg.JPG"
import maskBImg from "../../assets/maskBImg.JPG"
import maskCImg from "../../assets/maskCImg.JPG"
import maskDImg from "../../assets/maskDImg.JPG"
import maskEImg from "../../assets/maskEImg.JPG"

import { maskConstants } from "./constants.js"

const useStyles = makeStyles(style);

function MaskSelector(props) {
  const classes = useStyles();
  const placeholder = "hue, sat, val";
  return (
    <div className={classes.row}>
      <div className={classes.column}>
        <div className={classes.row}>
          <TextField
            label="HSV Lower Range 1"
            className={classes.textField}
            value={props.lowerMaskOne}
            placeholder={placeholder}
            onChange={props.onChangeLowerOne}
            margin="normal"
          />
          <TextField
            label="HSV Lower Range 2"
            className={classes.textField}
            value={props.lowerMaskTwo}
            placeholder={placeholder}
            onChange={props.onChangeLowerTwo}
            margin="normal"
          />
        </div>
        <div className={classes.row}>
          <TextField
            label="HSV Upper Range 1"
            className={classes.textField}
            value={props.upperMaskOne}
            placeholder={placeholder}
            onChange={props.onChangeUpperOne}
            margin="normal"
          />
          <TextField
            label="HSV Upper Range 2"
            className={classes.textField}
            value={props.upperMaskTwo}
            placeholder={placeholder}
            onChange={props.onChangeUpperTwo}
            margin="normal"
          />
        </div>
      </div>
      
      <div className={classes.column}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => props.changeMask(maskConstants["A"])}
          >
            Select Lightest Mask
        </Button>
        Best for:
        <img
          src={maskAImg}
          className={classes.exampleImage}
          alt=""
        />
      </div>
      <div className={classes.column}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => props.changeMask(maskConstants["B"])}
          >
            Select Light Mask
        </Button>
        Best for:
        <img
          src={maskBImg}
          className={classes.exampleImage}
          alt=""
        />
      </div>
      <div className={classes.column}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => props.changeMask(maskConstants["C"])}
          >
            Select Standard Mask
        </Button>
        Best for:
        <img
          src={maskCImg}
          className={classes.exampleImage}
          alt=""
        />
      </div>
      <div className={classes.column}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => props.changeMask(maskConstants["D"])}
          >
            Select Darker Mask
        </Button>
        Best for:
        <img
          src={maskDImg}
          className={classes.exampleImage}
          alt=""
        />
      </div>
      <div className={classes.column}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => props.changeMask(maskConstants["E"])}
          >
            Select Darkest Mask
        </Button>
        Best for:
        <img
          src={maskEImg}
          className={classes.exampleImage}
          alt=""
        />
      </div>
    </div>
  );
}

export default MaskSelector;
