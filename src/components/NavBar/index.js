import React from "react";

import { Button } from "@material-ui/core";

import styles from "./style.js";

const NavBar = (props) => {
  return (
    <div style={styles.container}>
      <Button
        style={styles.navButton}
        variant="contained"
        color="primary"
        onClick={() => props.history.push("/home")}
      >
        Go to home page
      </Button>
      <Button
        style={styles.navButton}
        variant="contained"
        color="primary"
        onClick={() => props.history.push("/single")}
      >
        Go to single-image measurement
      </Button>
    </div>
  );
};

export default NavBar;
