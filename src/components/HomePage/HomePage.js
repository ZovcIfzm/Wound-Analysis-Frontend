import React from "react";
import Cropper from "../ImageCropper/imageCropper";
import Button from "@material-ui/core/Button";

import CustomInput from "../CustomInput/CustomInput.js";
import styles from "./style.js";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import MaskSelector from "../MaskSelector/index.js";
import DebugToolbar from "../DebugToolbar/index.js";

import { maskConstants } from "../MaskSelector/constants.js"

import { Redirect } from "react-router";

class HomePage extends React.Component {
    state = {
        zipImgList: []
    };

    uploadDayZip = async (event) => {
        const zipFile = event.target.files[0]
        if (zipFile) {
        //const url = "https://gallagher-wound-analysis-api.herokuapp.com/zipMeasure";
        const url = "/zipMeasure"
        const form = new FormData();
        form.append("file", zipFile);
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
                alert("Images analyzed")
                console.log("imgList: ", imgList[0])
                this.setState({
                    zipImgList: imgList
                })
            })
            .catch((error) => console.log(error));
        } 
        else {
            alert("Please upload an zip file");
        }
    };

    goToMain = () => {
        this.props.history.push('/main');
    };

    reanalyzeImage = async (obj) => {
        this.props.history.push({
            pathname: '/main',
            state: { obj: obj }
        })
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classNames(classes.main, classes.mainRaised)}>
                <div className={classes.column}>
                    <div className={classes.container}>
                        <div className={classes.title}>
                            <h2>Automatic Wound Area Measurement</h2>
                        </div>
                    </div>
                    <Button 
                        className={classes.cropButton}
                        variant="contained"
                        color="primary"
                        onClick={this.goToMain}>
                        Single wound measurement
                    </Button>
                    <h3>Upload Zip File (One Day)</h3>
                    <Button
                        variant="contained"
                        component="label"
                        className={classes.cropButton}
                    >
                        Upload File
                        <input
                            type="file"
                            name="myImage"
                            hidden
                            onChange={this.uploadDayZip}
                        />
                    </Button>
                </div>
                <div className={classes.column}>
                    {this.state.zipImgList.map((obj) => (
                        <>
                            {
                                obj["error"] === false 
                                ?   <div className={classes.row}>
                                        <img
                                            src={obj["drawn_image"]}
                                            className={classes.colImage}
                                            alt=""
                                            onClick={() => this.reanalyzeImage(obj)}
                                        />
                                        <div className={classes.column}>
                                            <h3>Areas</h3>
                                            {
                                                obj["areas"].map((area)=>(
                                                    <h5>{area}</h5>
                                                ))
                                            }
                                        </div>
                                    </div>
                                :   <img
                                        src={obj["orig"]}
                                        className={classes.colImage}
                                        alt=""
                                        onClick={() => this.reanalyzeImage(obj)}
                                    />
                            }
                        </>
                    ))}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(HomePage);
