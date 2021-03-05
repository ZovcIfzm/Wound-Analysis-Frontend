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

import { useHistory } from "react-router-dom";

class HomePage extends React.Component {
    goToMain = () => {
        this.props.history.push('/main');
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classNames(classes.main, classes.mainRaised)}>
                <div className={classes.container}>
                    <div className={classes.title}>
                        <h2>Automatic Wound Area Measurement</h2>
                    </div>
                </div>
                <Button 
                    variant="contained"
                    color="primary"
                    onClick={this.goToMain}>
                    Single wound measurement
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(HomePage);
