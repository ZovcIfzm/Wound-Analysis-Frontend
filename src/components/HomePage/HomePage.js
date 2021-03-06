import React from "react";

import { Button, Checkbox, Tooltip, TextField } from '@material-ui/core';

import styles from "./style.js";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import MaskSelector from "../MaskSelector/index.js";

import baseImage from "../../assets/tutorial/single/baseImage.PNG"
import imageUploaded from "../../assets/tutorial/single/imageUploaded.PNG"
import multiAnalysisPageImg from "../../assets/tutorial/single/multiAnalysisPageImg.PNG"
import stepAreas from "../../assets/tutorial/single/stepAreas.PNG"
import stepChooseWidth from "../../assets/tutorial/single/stepChooseWidth.PNG"
import stepGridMasks from "../../assets/tutorial/single/stepGridMasks.PNG"
import stepGridMasks2 from "../../assets/tutorial/single/stepGridMasks2.PNG"
import stepImageMasked from "../../assets/tutorial/single/stepImageMasked.PNG"
import stepManualMask from "../../assets/tutorial/single/stepManualMask.PNG"
import stepMeasure from "../../assets/tutorial/single/stepMeasure.PNG"
import stepPressOk from "../../assets/tutorial/single/stepPressOk.PNG"
import uploadImageImg from "../../assets/tutorial/single/uploadImageImg.PNG"
import stepMultiSelect from "../../assets/tutorial/single/stepMultiSelect.PNG"

import { maskConstants } from "../MaskSelector/constants.js"
import {base_url} from "../../constants.js"

class HomePage extends React.Component {
    state = {
        zipImgList: [],
        lowerMaskOne: maskConstants["B"]["lower_range"][0],
        lowerMaskTwo: maskConstants["B"]["lower_range"][1],
        upperMaskOne: maskConstants["B"]["upper_range"][0],
        upperMaskTwo: maskConstants["B"]["upper_range"][1],
        imageWidth: 2.54,
        manualWidth: false,
    };

    componentDidMount(){
        //Wake up backend server
        //By sending a fetch request to the backend server, this will wake it up
        //Heroku automatically shuts down apps after a long period of inactivity

        let url = base_url;
        let form = new FormData();
        form.append("wakeup", "wakeup server");
        let analyze_options = {
            method: "POST",
            body: form,
        };
        fetch(url, analyze_options)
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
        .catch((error) => console.log(error));
    }

    goToSingle = () => {
        this.props.history.push('/single');
    };

    goToMulti = () => {
        this.props.history.push('/multi');
    }

    handleCheckbox = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classNames(classes.main, classes.mainRaised)}>
                <div className={classes.container}>
                    <div className={classes.row}>
                        <Button 
                            className={classes.cropButton}
                            variant="contained"
                            color="primary"
                            onClick={this.goToSingle}>
                            Go to single-image measurement
                        </Button>
                        <Button 
                            className={classes.cropButton}
                            variant="contained"
                            color="primary"
                            onClick={this.goToMulti}>
                            Go to multi-image measurement
                        </Button>
                    </div>
                    <div className={classes.column}>
                        <div className={classes.title}>
                            <h2>Automatic Wound Area Measurement</h2>
                            <h3>Home Page</h3>
                        </div>
                    </div>
                    <div className={classes.column}>
                        <h3>Tutorial</h3>
                        <div className={classes.column}>
                            <h4>Single-image measurement: </h4>
                            First, upload an image
                            <img
                                src={uploadImageImg}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            Now, you must set what the reference width for the image is. If it's automatic (default) it will measure the length of the green line (c) and set that to be equal to the referense width (a). If you set it to manual (b), it will instead take the width of the image, and set that to the reference width (a). This way the software knows how big the wound is in real life, and not just in pixels.
                            <img
                                src={stepChooseWidth}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            Now, we will measure the area of the wounds. It is highly recommended to first crop the image (1) to a smaller size that still includes the wounds and the green line (for auto-width), so that if you need to manually adjust the mask it is easier to see the borders. Second, we now select the mask (2) to identify what type of wound we're looking for, specifically this changes the HSV color ranges for finding what counts as the wound. Finally, press the MEASURE AREA button (3) and the areas will be calculated.
                            <img
                                src={stepMeasure}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            After pressing the button, the image will be sent to a server which analyses the image. After a few seconds, the server should finish analysis and send it back to your computer- after which there will be a popup as shown below. Press ok on the popup.
                            <img
                                src={stepPressOk}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            Borders are now generated on the image, and the areas of each border (from left to right) are calculated and displayed.
                            <img
                                src={stepImageMasked}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            For most images, the border will be close but not exact. There are two ways to make the border closer to the wound. The first (easier) is to look at the grid below. The grid automatically adjusts the wound mask to stricter and looser settings and displays. The center image is the image with the original mask. By clicking on any of the images, you will be able to re-analyze the image based on those settings.
                            <img
                                src={stepGridMasks}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            After clicking, and then pressing the ok button like before, you can now see that a new grid of stricter and looser masks is generated around the image selected in the last step. Similarly as we clicked the top left image before, the original settings are now in the bottom right image.
                            <img
                                src={stepGridMasks2}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            You can continue this process until you are satisifed. Similarlly, the second way to adjust the wound mask would be to use the manual adjustment settings shown below:
                            <img
                                src={stepManualMask}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            Each of these buttons has instructions showing how it changes the wound mask, i.e. changing what counts as a wound for the software. This can be used from the beginning, or used along with the grid method. Once you're done, the areas are listed in the location below, corresponding to the wounds on the image from left to right.
                            <img
                                src={stepAreas}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            <h4>Multi-image measurement: </h4>
                            The process for selecting the initial mask for the multi-image measurement method is the same except it uses only automatic width measurement. After selecting a mask, upload a zip file containing your images, it will process them in alphanumeric order.
                            After pressing UPLOAD AND ANALYZE ZIP FILE it will immedietly send the file to the server and begin analyzing. This will generally take longer than single-image measurement because there are more images in the zip file to analyze.
                            <img
                                src={multiAnalysisPageImg}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            Once you press ok from the popup, you will then see all the images. They are listed in order, using the green line as a width reference. The areas are listed for the wounds in order of left-to-right just like in single analysis. For most images, the mask will not be exactly correct, so you can click on the image itself in order to automatically go to the single-image measurement page with that image automatically transfered.
                            <img
                                src={stepMultiSelect}
                                className={classes.tutorialImage}
                                alt=""
                            />
                            <h4>Warnings/Closure</h4>
                            <li>Make sure the width of the green line is correctly measured, as that is what is being used as reference for the wound area. Depending on lighting conditions, the software may not correctly process all of the green line.</li>
                            <li>For some reason, if you've already send a zip file for analysis and want to send another zip file, you need to first reload the page. I've tried tracking down this bug for hours and hours and I've been unable to solve it, since it's not critical, I've put it on the backlog while I work on other more critical tasks.</li>
                            <li>Since this web application is hosted for free on Heroku, after a long period of inactivity the frontend app and backend server will shutdown, so if you load the page after a long time it will likely give you an error at first. Don't worry, this is just because the server is stopped. After you tried to open the page (url request), it asked Heroku to restart the server and by the time it gives you the error, it has already started up again and you can just reload the page and you'll see the app.</li>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(HomePage);
