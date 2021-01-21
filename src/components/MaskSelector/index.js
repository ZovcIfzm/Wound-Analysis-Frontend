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
            onClick={() => props.changeMask({
              "lower_range": [
                [0, 75, 70], [160, 75, 70]
              ],
              "upper_range": [
                [20, 255, 200], [180, 255, 200]
              ]
            })}
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
            onClick={() => props.changeMask({
              "lower_range": [
                [0, 95, 30], [150, 95, 30]
              ],
              "upper_range": [
                [30, 255, 197], [180, 255, 197]
              ]
            })}
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
            onClick={() => props.changeMask({
              "lower_range": [
                [0, 100, 20], [150, 100, 20]
              ],
              "upper_range": [
                [30, 255, 177], [180, 255, 177]
              ]
            })}
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
            onClick={() => props.changeMask({
              "lower_range": [
                [0, 105, 20], [150, 105, 20]
              ],
              "upper_range": [
                [30, 255, 167], [180, 255, 167]
              ]
            })}
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
            onClick={() => props.changeMask({
              "lower_range": [
                [0, 110, 0], [150, 110, 0]
              ],
              "upper_range": [
                [30, 255, 153], [180, 255, 153]
              ]
            })}
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
