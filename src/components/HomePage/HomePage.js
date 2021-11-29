import React, { useEffect, useState } from "react";

import NavBar from "../NavBar";

import styles from "./style.js";

import tutorial_1_uploaded from "../../assets/tutorial_11_28_21/tutorial_1_uploaded.PNG";
import tutorial_2_select_mask from "../../assets/tutorial_11_28_21/tutorial_2_select_mask.PNG";
import tutorial_3_measure_area from "../../assets/tutorial_11_28_21/tutorial_3_measure_area.PNG";
import tutorial_4_borders from "../../assets/tutorial_11_28_21/tutorial_4_borders.PNG";
import tutorial_5_areas from "../../assets/tutorial_11_28_21/tutorial_5_areas.PNG";
import tutorial_non_clean_1 from "../../assets/tutorial_11_28_21/tutorial_non_clean_1.PNG";
import tutorial_non_clean_2 from "../../assets/tutorial_11_28_21/tutorial_non_clean_2.PNG";
import tutorial_non_clean_3 from "../../assets/tutorial_11_28_21/tutorial_non_clean_3.PNG";
import tutorial_short_1 from "../../assets/tutorial_11_28_21/tutorial_short_1.PNG";
import tutorial_split_1_lines from "../../assets/tutorial_11_28_21/tutorial_split_1_lines.PNG";
import tutorial_split_2_edited from "../../assets/tutorial_11_28_21/tutorial_split_2_edited.PNG";
import tutorial_small_wound_1 from "../../assets/tutorial_11_28_21/tutorial_small_wound_1.PNG";
import tutorial_small_wound_2 from "../../assets/tutorial_11_28_21/tutorial_small_wound_2.PNG";
import tutorial_crop_1 from "../../assets/tutorial_11_28_21/tutorial_crop_1.PNG";

import { base_url } from "../../constants.js";

const HomePage = (props) => {
  useEffect(() => {
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
  }, []);

  return (
    <div style={{ ...styles.main, ...styles.mainRaised }}>
      <div style={styles.container}>
        <div style={styles.title}>
          <h2>Automatic Wound Area Measurement</h2>
          <h4>Home/Tutorial page</h4>
        </div>
        <NavBar history={props.history} />
        <div style={styles.column}>
          <h3>Tutorial</h3>
          <div style={styles.column}>
            <h4>Area measurement: </h4>
            The first step is to upload an image. By default, the software will
            look and measure the green line to use as a width reference.
            <img
              src={tutorial_1_uploaded}
              style={styles.tutorialImage}
              alt=""
            />
            After uploading an image, select a mask that tells the detector what
            counts as a wound.
            <img
              src={tutorial_2_select_mask}
              style={styles.tutorialImage}
              alt=""
            />
            Press the "Measure Area" button, and you'll get a notification when
            the image is analyzed.
            <img
              src={tutorial_3_measure_area}
              style={styles.tutorialImage}
              alt=""
            />
            After the image is analyzed, the image will now have borders on it.
            <img src={tutorial_4_borders} style={styles.tutorialImage} alt="" />
            At the bottom, the areas of these borders will be listed in order of
            left to right.
            <img src={tutorial_5_areas} style={styles.tutorialImage} alt="" />
            <h4>Adjusting borders</h4>
            About a third of the time the borders will require adjustments.
            <img
              src={tutorial_non_clean_1}
              style={styles.tutorialImage}
              alt=""
            />
            You can adjust the borders by adjusting the mask/detector settings,
            which simply checks for colors within a range. Each of the
            adjustments has a label to help you out. In this case, we want to
            "include more skin" as it will broaden the search parameters.
            <img
              src={tutorial_non_clean_2}
              style={styles.tutorialImage}
              alt=""
            />
            The borders are as you see above now.
            <img
              src={tutorial_non_clean_3}
              style={styles.tutorialImage}
              alt=""
            />
            <h4>Small wounds</h4>
            Areas too small are automatically filtered out and not shown.
            <img
              src={tutorial_small_wound_1}
              style={styles.tutorialImage}
              alt=""
            />
            You can adjust the filter to show smaller areas.
            <img
              src={tutorial_small_wound_2}
              style={styles.tutorialImage}
              alt=""
            />
            <h4>Short green lines</h4>
            Sometimes due to lighting, not all of the green line is detected.
            You can adjust the width value to account for that.
            <img src={tutorial_short_1} style={styles.tutorialImage} alt="" />
            <h4>Split green lines</h4>
            Sometimes, due to lighting, the green line might be split in the
            middle.
            <img
              src={tutorial_split_1_lines}
              style={styles.tutorialImage}
              alt=""
            />
            You can adjust the detector settings to broaden or restrict the
            search for what counts as the green line.
            <img
              src={tutorial_split_2_edited}
              style={styles.tutorialImage}
              alt=""
            />
            <h4>Manual width</h4>
            Worst case scenario, you can change the width measurement to manual
            to use the image width as reference rather then length of the green
            line. To do so, check the checkbox to convert to manual, then crop
            the image to the desired width.
            <img src={tutorial_crop_1} style={styles.tutorialImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
