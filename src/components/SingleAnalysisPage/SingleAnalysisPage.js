import React, { useEffect, useState } from "react";
import Cropper from "../ImageCropper/imageCropper";

import { Button, Checkbox, Tooltip, TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

import styles from "./style.js";
import classNames from "classnames";

import MaskSelector from "../MaskSelector/index.js";
import DebugToolbar from "../DebugToolbar/index.js";

import { maskConstants } from "../MaskSelector/constants.js"
import {base_url} from "../../constants.js"

import { Context } from "../context";

function SingleAnalysisPage (props) {
  
  const { classes } = props;
  const { lowerMaskOne, setLowerMaskOne, lowerMaskTwo, setLowerMaskTwo, upperMaskOne, setUpperMaskOne, upperMaskTwo, setUpperMaskTwo, setMask, zipImgList, setZipImgList, isManualMask, setIsManualMask } = React.useContext(Context)
  const [currentImage, setCurrentImage] = useState()
  const [originalImage, setOriginalImage] = useState()
  const [currentImages, setCurrentImages] = useState()
  const [edgedImage, setEdgedImage] = useState()
  const [analyzed, setAnalyzed] = useState(false)
  const [imageWidth, setImageWidth] = useState(2.54)
  const [useCrop, setUseCrop] = useState(false)
  const [areas, setAreas] = useState([])
  const [testImage, setTestImage] = useState()
  const [obj, setObj] = useState()
  const [manualWidth, setManualWidth] = useState(false)
  const [jumpHeading, setJumpHeading] = useState()

  useEffect(() => {
    if (props.location.state != null){
      const inState = props.location.state
      const obj = props.location.state.obj
      if (obj != null){
        
        if (obj["drawn_image"]){ 
          setCurrentImage(obj["drawn_image"])
        }
        else{
          setCurrentImage(obj["orig"])
        }
          setOriginalImage(obj["orig"])
          setJumpHeading(obj["id"])
      }
      setZipImgList(inState.zipImgList)
    }
  })

  const goToMulti = () => {
    if (zipImgList != null){
      props.history.push({
        pathname: '/multi',
        state: { zipImgList: zipImgList }
      })
    }
    else{
      props.history.push('/multi');
    }
  }
  
  const goToHome = () => {
    props.history.push('/home');
  }

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  const completeCrop = (image) => {
    setUseCrop(false)
    setCurrentImage(image)
    setOriginalImage(image)
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let imgFile = event.target.files[0];
      //let idCardBase64 = '';
      getBase64(imgFile, (result) => {
        setCurrentImage(result)
        setOriginalImage(result)
      });
    }
  };

  const reanalyzeImage = async (obj) => {
    setIsManualMask(true)
    setLowerMaskOne(obj["lower_range"][0])
    setLowerMaskTwo(obj["lower_range"][1])
    setUpperMaskOne(obj["upper_range"][0])
    setUpperMaskTwo(obj["upper_range"][1])
    analyzeImage(obj["lower_range"][0], obj["lower_range"][1], obj["upper_range"][0], obj["upper_range"][1], true)
  };

  const analyzeImage = async (lowMaskOne, lowMaskTwo, upMaskOne, upMaskTwo, specifiedManualMask=false) => {
    if (currentImage && imageWidth) {
      const url = base_url + "/measure";
      //const url = "/measure"
      const form = new FormData();
      form.append("base64", originalImage);
      form.append("width", imageWidth);
      form.append("manual_width", manualWidth)
      form.append("lower_mask_one", lowMaskOne);
      form.append("lower_mask_two", lowMaskTwo);
      form.append("upper_mask_one", upMaskOne);
      form.append("upper_mask_two", upMaskTwo);
      if (specifiedManualMask){
        form.append("manual_mask", specifiedManualMask);
      }
      else{
        form.append("manual_mask", isManualMask);
      }

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
        .then((matrix) => {
          if (matrix[1][1]["error"] == false){
            setAnalyzed(true)
            setCurrentImage(matrix[1][1]["drawn_image"])
            setOriginalImage(matrix[1][1]["orig"])
            setEdgedImage(matrix[1][1]["edged_image"])
            setCurrentImages(matrix)
            setAreas(matrix[1][1]["areas"])
            alert("Images analyzed")
          }
          else{
            alert(matrix[1][1]["error_message"])
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
    setImageWidth(event.target.value)
  };

  const handleCropChange = () => {
    setUseCrop(true)
  };

  const handleChangeTestImage = (image) => {
    setTestImage(image)
  }

  const isManualWidth = () => {
    setManualWidth(!manualWidth)
  };

  return (
    <div className={classNames(classes.main, classes.mainRaised)}>
      <div className={classes.container}>
        <div className={classes.row}>
            <Button 
                className={classes.cropButton}
                variant="contained"
                color="primary"
                onClick={goToHome}>
                Go to home page
            </Button>
            <Button 
                className={classes.cropButton}
                variant="contained"
                color="primary"
                onClick={goToMulti}>
                Go to multi-image measurement
            </Button>
          </div>
        <div className={classes.title}>
          <h2>Automatic Wound Area Measurement</h2>
          <h4>Single-image measurement</h4>
        </div>
        <div className={classes.row}>
          <div className={classes.column}>
            <div className={classes.button} style={{ flex: 1 }}>
              <h3>Upload Image</h3>
              <Button
                      variant="contained"
                      component="label"
                  >
                  Upload Image
                  <input
                      type="file"
                      name="myImage"
                      hidden
                      onChange={onImageChange}
                  />
                  </Button>
            </div>
            <div className={classes.column}>
              <div style={{"height": 40}}/>
              <Tooltip title="This is the length of the green line, if manual, this is the width of the image" placement="top-start">
                <TextField
                  id="standard-number"
                  label="Enter reference width (cm)"
                  defaultValue={imageWidth}
                  InputProps={{
                    onChange: handleWidthChange,
                  }}
                />
              </Tooltip>
              <div className={classes.row}>
                <Checkbox
                  checked={manualWidth}
                  onChange={() => isManualWidth()}
                  value="manualWidth"
                />
                <div className={classes.centeredText}>Set width to manual</div>
              </div>
            </div>
          </div>

          <div className={classes.column}>
            
            {useCrop ? (
              <Cropper
                currentImage={originalImage}
                completeCrop={completeCrop}
              />
              ) : <>
                    <h3>Image {jumpHeading}</h3>
                    <div className={classes.column}>
                        <img
                          src={currentImage}
                          className={classes.images}
                          alt=""
                        />
                        <Button
                          className={classes.cropButton}
                          variant="contained"
                          color="primary"
                          onClick={handleCropChange}
                        >
                          Crop Image
                        </Button>
                      </div>
                  </>
            }
          </div>
        </div>
        <MaskSelector/>
        <div className={classes.row}>
          <div className={classes.column}>
            <h3>Current areas:</h3>
            {areas.map((value, i) => (
              <b key={i}>{value}cm^2</b>
            ))}

            <Button
              variant="contained"
              color="primary"
              onClick={() => analyzeImage(lowerMaskOne, lowerMaskTwo, upperMaskOne, upperMaskTwo)}
              className={classes.cropButton}
            >
              Measure area
            </Button>
          </div>
        </div>
        { currentImages ?
        <div className={classes.column}>
          <p>Stricter farther right (+sat) and down (+val)</p>
          {currentImages.map((row, i) => (
            <div key={i} className={classes.row}>
            {row.map((obj, i) => (
              <img
                key={i}
                src={obj["drawn_image"]}
                className={classes.gridImage}
                alt=""
                onClick={() => reanalyzeImage(obj)}
              />
            ))}
            </div>
          ))}
        </div>
        : null
        }
      </div>
    </div>
  );
}

export default withStyles(styles)(SingleAnalysisPage);
