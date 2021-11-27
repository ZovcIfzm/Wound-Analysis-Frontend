import React from "react";
import { Button, Tooltip, TextField } from "@material-ui/core";
import styles from "./style.js";

import { lineConstants } from "./constants.js";
import { Context } from "../context";

const LineMaskSelector = (props) => {
  const { settings, setSettings } = React.useContext(Context);

  const placeholder = "hue, sat, val";

  const modifyLowerSat = (val) => {
    let newLowerBound = [...settings.lineLowerBound];
    newLowerBound[1] = Math.min(255, newLowerBound[1] + val);

    setSettings((prevSettings) => ({
      ...prevSettings,
      lineLowerBound: newLowerBound,
    }));
  };

  const handleLowerBoundChange = (event) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      lineLowerBound: event.target.value,
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.column}>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setSettings((prevSettings) => ({
              ...prevSettings,
              autoLineMask: !prevSettings.autoLineMask,
            }))
          }
        >
          {settings.autoLineMask
            ? "Customize green line detector"
            : "Close editor"}
        </Button>
        {!settings.autoLineMask ? (
          <div>
            <div style={{ height: 20 }} />
            <div style={styles.row}>
              <div style={styles.column}>
                <Tooltip
                  title="Reduce saturation (2nd value) to include more of the line, increase to include less"
                  placement="top-start"
                >
                  <TextField
                    label="HSV Lower Range"
                    style={styles.textField}
                    value={settings.lineLowerBound}
                    placeholder={placeholder}
                    onChange={handleLowerBoundChange}
                    margin="normal"
                  />
                </Tooltip>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    setSettings((prevSettings) => ({
                      ...prevSettings,
                      lineLowerBound: lineConstants["LINELOWERBOUND"],
                    }))
                  }
                >
                  Reset detector settings
                </Button>
              </div>

              <div style={styles.column}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ ...styles.hsvButton, backgroundColor: "green" }}
                  onClick={() => modifyLowerSat(5)}
                >
                  Reduce search for green line (+sat)
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ ...styles.hsvButton, backgroundColor: "lightgreen" }}
                  onClick={() => modifyLowerSat(-5)}
                >
                  Broaden search for green line (-sat)
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LineMaskSelector;
