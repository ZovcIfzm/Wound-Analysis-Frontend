import React from "react";

import { Button, Checkbox, Tooltip, TextField } from '@material-ui/core';

import styles from "./style.js";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import MaskSelector from "../MaskSelector/index.js";

import { maskConstants } from "../MaskSelector/constants.js"
import {base_url} from "../../constants.js"

class MultiAnalysisPage extends React.Component {
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
        if (this.props.location.state != null){
            const inState = this.props.location.state
            this.setState({
                zipImgList: inState.zipImgList
            }) 
        }

        let url = base_url;
        //const url = "/"
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

    uploadDayZip = async (event) => {
        let zipFile = event.target.files[0]
        if (zipFile) {
            let url = base_url + "/zipMeasure";
            //let url = "/zipMeasure"
            let form = new FormData();
            form.append("file", zipFile);
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
                .then((imgList) => {
                    alert("Images analyzed")
                    this.setState({
                        zipImgList: imgList
                    })
                })
                .catch((error) => {
                    if (error instanceof TypeError){
                        alert("Too many images, make a smaller Zip file")
                    }
                    else{
                        console.log(error)
                        alert("Unknown error, let Alex know about this. Error:", error)
                    }
                })                 
            } 
        else {
            alert("Please upload an zip file");
        }
    };

    goToSingle = () => {
        if (this.state.zipImgList != null){
            this.props.history.push({
                pathname: '/single',
                state: { obj: null, zipImgList: this.state.zipImgList }
            })
        }
        else{
            this.props.history.push('/single');
        }
    };

    goToHome = () => {
        this.props.history.push('/home');
    };

    reanalyzeImage = async (obj, i) => {
        obj["id"] = i;
        this.props.history.push({
            pathname: '/single',
            state: { obj: obj, zipImgList: this.state.zipImgList }
        })
    };

    handleCheckbox = name => event => {
        this.setState({ [name]: event.target.checked });
    };

        
    handleWidthChange = (event) => {
        this.setState({
            imageWidth: event.target.value,
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
        
    changeMask = async (mask) => {
        this.setState({
        lowerMaskOne: mask["lower_range"][0],
        lowerMaskTwo: mask["lower_range"][1],
        upperMaskOne: mask["upper_range"][0],
        upperMaskTwo: mask["upper_range"][1],
        })
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
                    <div className={classes.row}>
                        <Button 
                            className={classes.cropButton}
                            variant="contained"
                            color="primary"
                            onClick={this.goToHome}>
                            Go to home page
                        </Button>
                        <Button 
                            className={classes.cropButton}
                            variant="contained"
                            color="primary"
                            onClick={this.goToSingle}>
                            Go to single-image measurement
                        </Button>
                    </div>
                    <div className={classes.column}>
                        <div className={classes.title}>
                            <h2>Automatic Wound Area Measurement</h2>
                            <h4>Multi-image measurement</h4>
                        </div>
                    </div>
                    <div className={classes.column}>
                        <div style={{"height": 20}}/>
                        <Tooltip title="This is the length of the green line" placement="top-start">
                        <TextField
                            id="standard-number"
                            label="Enter reference width (cm)"
                            defaultValue={this.state.imageWidth}
                            InputProps={{
                            onChange: this.handleWidthChange,
                            }}
                        />
                        </Tooltip>
                    </div>
                    <div className={classes.column}>
                        <h4>Select default mask</h4>
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
                    <div style={{"height": 10}}/>
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
                    <div style={{"height": 50}}/>
                    <div className={classes.column}>
                        <Button
                            variant="contained"
                            component="label"
                            
                            color="primary"
                            className={classes.analyzeButton}
                        >
                            Upload and analyze ZIP file
                            <input
                                type="file"
                                name="myImage"
                                hidden
                                onChange={this.uploadDayZip}
                            />
                        </Button>
                    </div>
                    <div className={classes.column}>
                        {this.state.zipImgList.map((obj, i) => (
                            <div key={i} id={"zipImg"+i}>
                                {
                                    obj["error"] === false 
                                    ?   <div className={classes.row}>
                                            <img
                                                src={obj["drawn_image"]}
                                                className={classes.colImage}
                                                alt=""
                                                onClick={() => this.reanalyzeImage(obj, i)}
                                            />
                                            <div className={classes.column}>
                                                <h3>Image: {i}</h3>
                                                <h3>Areas</h3>
                                                {
                                                    obj["areas"].map((area)=>(
                                                        <h5>{area}cm^2</h5>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    :   <div className={classes.row}>
                                            <img
                                                src={obj["orig"]}
                                                className={classes.colImage}
                                                alt=""
                                                onClick={() => this.reanalyzeImage(obj, i)}
                                            />
                                            <p>Error: {obj["error_message"]}</p>
                                        </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(MultiAnalysisPage);
