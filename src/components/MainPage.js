import React from "react";
import Cropper from "./ImageCropper/imageCropper";
import Button from "@material-ui/core/Button";

import CustomInput from "./CustomInput/CustomInput.js";
import styles from "./style.js";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import MaskSelector from "./MaskSelector/index.js";

class MainPage extends React.Component {
  state = {
    currentImage: null,
    currentImages: null,
    currentImageFile: null,
    edgedImage: null,
    analyzed: false,
    imageWidth: null,
    useCrop: false,
    areas: [],
    lowerMaskOne: "0, 100, 20",
    lowerMaskTwo: "150, 100, 20",
    upperMaskOne: "30, 255, 177",
    upperMaskTwo: "180, 255, 177",
  };

  completeCrop = (image, imageFile) => {
    this.setState({
      useCrop: false,
      currentImage: image,
      currentImageFile: imageFile,
    });
  };

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let imgFile = event.target.files[0];
      this.setState({
        currentImage: URL.createObjectURL(imgFile),
        currentImageFile: imgFile,
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
    /*this.setState({
      testText: "in analyze"
    })*/
    if (this.state.currentImage && this.state.imageWidth) {
      //const url = "https://gallagher-wound-analysis-api.herokuapp.com/measure";
      const url = "/measure"
      const form = new FormData();
      form.append("file", this.state.currentImageFile);
      form.append("mode", "run");
      form.append("width", this.state.imageWidth);
      console.log(this.state.lowerMaskOne);
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
          /*this.setState({
            testText: "fetched"
          })*/
          return response.json();
        })
        .then((matrix) => {
          this.setState({
            analyzed: true,
            currentImage: matrix[1][1]["drawn_image"],
            edgedImage: matrix[1][1]["edged_image"],
            currentImages: matrix,
            areas: matrix[1][1]["areas"]
          });
          alert("Images analyzed")
          //testText: "afterFetched"
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

  handleOnChange = (event) => {
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

  render() {
    const { classes } = this.props;
    return (
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <div className={classes.title}>
            <h2>Automatic Wound Area Measurement</h2>
          </div>
          <div className={classes.row}>
            <div className={classes.column}>
              <div className={classes.button} style={{ flex: 1 }}>
                <h3>Upload Image</h3>
                <input
                  type="file"
                  name="myImage"
                  onChange={this.onImageChange}
                />
              </div>
              <div style={{ width: "25%", flex: 1 }}>
                <CustomInput
                  labelText="Enter real image width"
                  id="float"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: this.handleOnChange,
                  }}
                />
              </div>
            </div>
            <div className={classes.column}>
              <h3>Image</h3>
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
              {this.state.useCrop ? (
                <Cropper
                  currentImage={this.state.currentImage}
                  completeCrop={this.completeCrop}
                />
              ) : this.state.analyzed ? (
                <>
                  <h4>Image with current mask</h4>
                  <img
                    src={"data:image/png;base64," + this.state.currentImage}
                    className={classes.images}
                    alt=""
                  />
                </>
              ) : null}
            </div>
          </div>
          <h3>Current areas:</h3>
          {this.state.areas.map((value) => (
            <p>{value} u^2</p>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={this.analyzeImage}
          >
            Measure area
          </Button>
          { this.state.analyzed ?
          <div className={classes.column}>
            {this.state.currentImages.map((row) => (
              <div className={classes.row}>
              {row.map((obj) => (
                <img
                src={"data:image/png;base64," + obj["drawn_image"]}
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
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MainPage);
