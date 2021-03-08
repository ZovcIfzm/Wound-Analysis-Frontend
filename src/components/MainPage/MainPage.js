import React from "react";
import Cropper from "../ImageCropper/imageCropper";

import { Button, Checkbox, Tooltip, TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

import styles from "./style.js";
import classNames from "classnames";

import MaskSelector from "../MaskSelector/index.js";
import DebugToolbar from "../DebugToolbar/index.js";

import { maskConstants } from "../MaskSelector/constants.js"

class MainPage extends React.Component {
  state = {
    currentImage: null,
    originalImage: null,
    currentImages: null,
    edgedImage: null,
    analyzed: false,
    imageWidth: 2.54,
    useCrop: false,
    areas: [],
    lowerMaskOne: maskConstants["B"]["lower_range"][0],
    lowerMaskTwo: maskConstants["B"]["lower_range"][1],
    upperMaskOne: maskConstants["B"]["upper_range"][0],
    upperMaskTwo: maskConstants["B"]["upper_range"][1],
    testImage: null,
    obj: null,
    manualWidth: false,
    jumpHeading: null,
    zipImgList: null,
  };

  componentDidMount(){
    if (this.props.location.state != null){
      const inState = this.props.location.state
      const obj = this.props.location.state.obj
      if (obj != null){
        
        if (obj["drawn_image"]){ 
          this.setState({
            currentImage: obj["drawn_image"],
          }) 
        }
        else{
          this.setState({
            currentImage: obj["orig"],
          }) 
        }
        this.setState({
          originalImage: obj["orig"],
          jumpHeading: obj["id"]
        })
      }
      this.setState({
        zipImgList: inState.zipImgList
      }) 
    }
  }

  goToHome = () => {
    if (this.state.zipImgList != null){
      this.props.history.push({
        pathname: '/home',
        state: { zipImgList: this.state.zipImgList }
      })
    }
    else{
      this.props.history.push('/home');
    }
  }

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  completeCrop = (image) => {
    this.setState({
      useCrop: false,
      currentImage: image,
      originalImage: image,
    });
  };

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let imgFile = event.target.files[0];
      //let idCardBase64 = '';
      this.getBase64(imgFile, (result) => {
        this.setState({
          currentImage: result,
          originalImage: result,
        });
      });
    }
  };

  changeMask = async (mask) => {
    this.setState({
      lowerMaskOne: mask["lower_range"][0],
      lowerMaskTwo: mask["lower_range"][1],
      upperMaskOne: mask["upper_range"][0],
      upperMaskTwo: mask["upper_range"][1],
    })
  };
  reanalyzeImage = async (obj) => {
    this.setState({
      lowerMaskOne: obj["lower_range"][0],
      lowerMaskTwo: obj["lower_range"][1],
      upperMaskOne: obj["upper_range"][0],
      upperMaskTwo: obj["upper_range"][1],
    }, () => {
      this.analyzeImage()
    })
  };
  analyzeImage = async () => {
    if (this.state.currentImage && this.state.imageWidth) {
      const url = "https://gallagher-wound-analysis-api.herokuapp.com/measure";
      //const url = "/measure"
      const form = new FormData();
      form.append("base64", this.state.originalImage);
      form.append("width", this.state.imageWidth);
      form.append("manual_width", this.state.manualWidth)
      form.append("lower_mask_one", this.state.lowerMaskOne);
      form.append("lower_mask_two", this.state.lowerMaskTwo);
      form.append("upper_mask_one", this.state.upperMaskOne);
      form.append("upper_mask_two", this.state.upperMaskTwo);

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
            this.setState({
              analyzed: true,
              currentImage: matrix[1][1]["drawn_image"],
              originalImage: matrix[1][1]["orig"],
              edgedImage: matrix[1][1]["edged_image"],
              currentImages: matrix,
              areas: matrix[1][1]["areas"]
            });
            alert("Images analyzed")
          }
          else{
            alert(matrix[1][1]["error_message"])
          }
        })
        .catch((error) => console.log(error));
    } else if (this.state.currentImage && !this.state.imageWidth) {
      alert("Please specify an image width");
    } else if (!this.state.currentImage && this.state.imageWidth) {
      alert("Please upload an image");
    } else {
      alert("Please upload an image and specify it's real width");
    }
  };

  handleWidthChange = (event) => {
    this.setState({
      imageWidth: event.target.value,
    });
  };

  handleCropChange = () => {
    this.setState({
      useCrop: true,
    });
  };

  handleLowerMaskOneChange = (event) => {
    this.setState({
      lowerMaskOne: event.target.value,
    });
  };

  handleLowerMaskTwoChange = (event) => {
    this.setState({
      lowerMaskTwo: event.target.value,
    });
  };

  handleUpperMaskOneChange = (event) => {
    this.setState({
      upperMaskOne: event.target.value,
    });
  };

  handleUpperMaskTwoChange = (event) => {
    this.setState({
      upperMaskTwo: event.target.value,
    });
  };

  handleChangeTestImage = (image) => {
    this.setState({
      testImage: image,
    })
  }

  handleCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  modifyLowerSat = (val) => {
    let newLowerMaskOne = [...this.state.lowerMaskOne];
    let newLowerMaskTwo = [...this.state.lowerMaskTwo];
    newLowerMaskOne[1] += val;
    newLowerMaskTwo[1] += val;    

    if (newLowerMaskOne[1] > 255){
      newLowerMaskOne[1] = 255;
    }
    if (newLowerMaskTwo[1] > 255){
      newLowerMaskTwo[1] = 255;
    }
    if (newLowerMaskOne[1] > this.state.upperMaskOne[1] || newLowerMaskTwo[1] > this.state.upperMaskTwo[1]){
      alert("Cannot increase lower sat above upper sat")
    }
    else{
      this.setState({
        lowerMaskOne: newLowerMaskOne,
        lowerMaskTwo: newLowerMaskTwo,
      })
    }
  }
  modifyUpperSat = (val) => {
    let newUpperMaskOne = [...this.state.upperMaskOne];
    let newUpperMaskTwo = [...this.state.upperMaskTwo];
    newUpperMaskOne[1] += val;    
    newUpperMaskTwo[1] += val;

    if (newUpperMaskOne[1] > 255){
      newUpperMaskOne[1] = 255;
    }
    if (newUpperMaskTwo[1] > 255){
      newUpperMaskTwo[1] = 255;
    }
    if (newUpperMaskOne[1] < this.state.lowerMaskOne[1] || newUpperMaskTwo[1] < this.state.lowerMaskTwo[1]){
      alert("Cannot lower upper sat below lower sat")
    }
    else{
      this.setState({
        upperMaskOne: newUpperMaskOne,
        upperMaskTwo: newUpperMaskTwo,
      })
    }
  }

  modifyLowerVal = (val) => {
    let newLowerMaskOne = [...this.state.lowerMaskOne];
    let newLowerMaskTwo = [...this.state.lowerMaskTwo];
    newLowerMaskOne[2] += val;
    newLowerMaskTwo[2] += val;    

    if (newLowerMaskOne[2] > 255){
      newLowerMaskOne[2] = 255;
    }
    if (newLowerMaskTwo[2] > 255){
      newLowerMaskTwo[2] = 255;
    }
    if (newLowerMaskOne[2] > this.state.upperMaskOne[2] || newLowerMaskTwo[2] > this.state.upperMaskTwo[2]){
      alert("Cannot increase lower val above upper val")
    }
    else{
      this.setState({
        lowerMaskOne: newLowerMaskOne,
        lowerMaskTwo: newLowerMaskTwo,
      })
    }
  }
  modifyUpperVal = (val) => {
    let newUpperMaskOne = [...this.state.upperMaskOne];
    let newUpperMaskTwo = [...this.state.upperMaskTwo];
    newUpperMaskOne[2] += val;    
    newUpperMaskTwo[2] += val;

    if (newUpperMaskOne[2] > 255){
      newUpperMaskOne[2] = 255;
    }
    if (newUpperMaskTwo[2] > 255){
      newUpperMaskTwo[2] = 255;
    }
    if (newUpperMaskOne[2] < this.state.lowerMaskOne[2] || newUpperMaskTwo[2] < this.state.lowerMaskTwo[2]){
      alert("Cannot lower upper val below lower val")
    }
    else{
      this.setState({
        upperMaskOne: newUpperMaskOne,
        upperMaskTwo: newUpperMaskTwo,
      })
    }
  }

  modifyHueRange = (val) => {    
    let newLowerMaskTwo = [...this.state.lowerMaskTwo];
    let newUpperMaskOne = [...this.state.upperMaskOne];
    
    newLowerMaskTwo[0] -= val;    
    newUpperMaskOne[0] += val;    

    if (newLowerMaskTwo[0] < 0){
      newLowerMaskTwo[0] = 0;
    }
    if (newUpperMaskOne[0] > 180){
      newUpperMaskOne[0] = 180;
    }

    this.setState({
      lowerMaskTwo: newLowerMaskTwo,
      upperMaskOne: newUpperMaskOne,
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
            <Button 
                variant="contained"
                color="primary"
                onClick={this.goToHome}>
                Back to Homepage
            </Button>
          <div className={classes.title}>
            <h2>Automatic Wound Area Measurement</h2>
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
                        onChange={this.onImageChange}
                    />
                    </Button>
              </div>
              <div className={classes.column}>
                <div style={{"height": 40}}/>
                <Tooltip title="This is the length of the green line, if manual, this is the width of the image" placement="top-start">
                  <TextField
                    id="standard-number"
                    label="Enter reference width (cm)"
                    defaultValue={this.state.imageWidth}
                    InputProps={{
                      onChange: this.handleWidthChange,
                    }}
                  />
                </Tooltip>
                <div className={classes.row}>
                  <Checkbox
                    checked={this.state.manualWidth}
                    onChange={this.handleCheckbox('manualWidth')}
                    value="manualWidth"
                  />
                  <div className={classes.centeredText}>Set width to manual</div>
                </div>
              </div>
            </div>

            <div className={classes.column}>
              
              {this.state.useCrop ? (
                <Cropper
                  currentImage={this.state.originalImage}
                  completeCrop={this.completeCrop}
                />
                ) : <>
                        {       
                          this.state.analyzed ? (
                            <>
                              <h4>Image with current mask</h4>
                              <img
                                src={this.state.currentImage}
                                className={classes.images}
                                alt=""
                              />
                            </>
                          ) : null
                        }
                      <h3>Image {this.state.jumpHeading}</h3>
                      <div className={classes.column}>
                          <img
                            src={this.state.currentImage}
                            className={classes.images}
                            alt=""
                          />
                          <Button
                            className={classes.cropButton}
                            variant="contained"
                            color="primary"
                            onClick={this.handleCropChange}
                          >
                            Crop Image
                          </Button>
                        </div>
                    </>
              }
            </div>
          </div>
          <div style={{"height":20}}/>
          <MaskSelector
              lowerMaskOne={this.state.lowerMaskOne}
              lowerMaskTwo={this.state.lowerMaskTwo}
              upperMaskOne={this.state.upperMaskOne}
              upperMaskTwo={this.state.upperMaskTwo}
              onChangeLowerOne={this.handleLowerMaskOneChange.bind(this)}
              onChangeLowerTwo={this.handleLowerMaskTwoChange.bind(this)}
              onChangeUpperOne={this.handleUpperMaskOneChange.bind(this)}
              onChangeUpperTwo={this.handleUpperMaskTwoChange.bind(this)}
              changeMask={this.changeMask}
          />
          <div style={{"height":20}}/>
          <div className={classes.row}>
            <div className={classes.column}>
              <h3>Current areas:</h3>
              {this.state.areas.map((value, i) => (
                <b key={i}>{value}cm^2</b>
              ))}

              <Button
                variant="contained"
                color="primary"
                onClick={this.analyzeImage}
                className={classes.cropButton}
              >
                Measure area
              </Button>
            </div>
            <div className={classes.row}>
              <div className={classes.column}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{"backgroundColor": "maroon"}}
                  onClick={()=>this.modifyLowerSat(5)}
                  className={classes.hsvButton}
                >
                  Look for redder wounds (+sat)
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{"backgroundColor": "pink"}}
                  onClick={()=>this.modifyLowerSat(-5)}
                  className={classes.hsvButton}
                >
                  Look for pinker wounds (-sat)
                </Button>
              </div>
              <div className={classes.column}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{"backgroundColor": "#800200"}}
                  onClick={()=>this.modifyLowerVal(5)}
                  className={classes.hsvButton}
                >
                  Look for brighter wounds (+val)
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{"backgroundColor": "black"}}
                  onClick={()=>this.modifyLowerVal(-5)}
                  className={classes.hsvButton}
                >
                  Look for darker wounds (-val)
                </Button>
              </div>
              <div className={classes.column}>
                <Button
                    variant="contained"
                    color="primary"
                    style={{"backgroundColor": "green"}}
                    onClick={()=>this.modifyUpperVal(5)}
                    className={classes.hsvButton}
                  >
                    Include more skin (+upperVal)
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    style={{"backgroundColor": "green"}}
                    onClick={()=>this.modifyUpperVal(-5)}
                    className={classes.hsvButton}
                  >
                    Include less skin (-upperVal)
                </Button>
              </div>
              <div className={classes.column}>
                <Button
                    variant="contained"
                    color="primary"
                    style={{"backgroundColor": "green"}}
                    onClick={()=>this.modifyHueRange(5)}
                    className={classes.hsvButton}
                  >
                    Include more wound colors (+hue range)
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    style={{"backgroundColor": "green"}}
                    onClick={()=>this.modifyHueRange(-5)}
                    className={classes.hsvButton}
                  >
                    Reduce range of possible colors (-hue range)
                </Button>
              </div>
            </div>
          </div>
          { this.state.analyzed ?
          <div className={classes.column}>
            <p>Stricter farther right (+sat) and down (+val)</p>
            {this.state.currentImages.map((row, i) => (
              <div key={i} className={classes.row}>
              {row.map((obj) => (
                <img
                src={obj["drawn_image"]}
                className={classes.gridImage}
                alt=""
                onClick={() => this.reanalyzeImage(obj)}
                />
              ))}
              </div>
            ))}
          </div>
          : null
          }
          <div style={{"height": 100}}/>
          <DebugToolbar
            originalImage={this.state.originalImage}
            testImage={this.state.testImage}
            changeTestImage={this.handleChangeTestImage.bind(this)}
          />   
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MainPage);
