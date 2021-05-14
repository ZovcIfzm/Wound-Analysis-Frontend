import React from "react";
import TextField from "@material-ui/core/TextField";
import style from "./style.js";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import {base_url} from "../../constants.js"
const useStyles = makeStyles(style);



function DebugToolbar(props) {
  const classes = useStyles();
  const placeholder = "hue, sat, val";
  return (
    <div className={classes.column}>    
      Debugging Toolbar:  
      <div className={classes.column}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const url = base_url + "/testImage";
              //const url = "/testImage"
              const form = new FormData();
              form.append("file", props.originalImage);
              const analyze_options = {
                method: "POST",
                body: form,
              };
              fetch(url, analyze_options)
                .then((response) => {
                  if (!response.ok) throw Error(response.statusText);
                  return response.json();
                })
                .then((image => {
                  props.changeTestImage(image)
                }))
                .catch((error) => console.log(error)); 
            }}
          >
            Test Sending/Retrieving Image from API
        </Button>
        <img
          src={"data:image/png;base64," + props.testImage}
          className={classes.exampleImage}
          alt=""
        />
      </div>
    </div>
  );
}

export default DebugToolbar;
