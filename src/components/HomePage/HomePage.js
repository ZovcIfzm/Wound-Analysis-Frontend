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
import multi_normal_steps from "../../assets/tutorial/multi/multi_sameAsSingle.PNG";
import multi_individual from "../../assets/tutorial/multi/multi_individual.PNG";

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
          <h1>Tutorial</h1>
          <h2>Single-Image Measurement</h2>
          <div style={styles.column}>
            <div style={styles.row}>
              <div style={styles.column}>
                The first step is to upload an image. By default, the software
                will look and measure the green line to use as a width
                reference.
              </div>
              <div style={styles.column}>
                After uploading an image, select a mask that tells the detector
                what counts as a wound.
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.column}>
                <img
                  src={tutorial_1_uploaded}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>
              <div style={styles.column}>
                <img
                  src={tutorial_2_select_mask}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.column}>
                Press the "Measure Area" button, and you'll get a notification
                when the image is analyzed.
              </div>

              <div style={styles.column}>
                After the image is analyzed, the image will now have borders on
                it.
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.column}>
                <img
                  src={tutorial_3_measure_area}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>

              <div style={styles.column}>
                <img
                  src={tutorial_4_borders}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>
            </div>
            <div style={styles.tutorialSingleColumn}>
              At the bottom, the areas of these borders will be listed in order
              of left to right.
              <img src={tutorial_5_areas} style={styles.tutorialImage} alt="" />
            </div>

            <h2>Multi-Image Measurement</h2>
            <div style={styles.row}>
              <div style={styles.column}>
                The first three steps are the same as in single-image
                measurement. Select a mask, write a reference width, and then
                upload images. The difference is that uploading images must be
                done last, and that analysis is automatically done after upload.
                It will take more time than single-image measurement to analyze,
                as there are more images to analyze.
              </div>

              <div style={styles.column}>
                After you get your results, you may individually re-analyze any
                of the results by pressing on the image, rerouting you to
                single-image measurement. Your results from multi-image
                measurement will be saved, so if you navigate back to
                multi-image measurement you will see your results again.
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.column}>
                <img
                  src={multi_normal_steps}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>

              <div style={styles.column}>
                <img
                  src={multi_individual}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>
            </div>
            <h1>Adjustments/Edge cases</h1>
            <h2>Adjusting borders</h2>
            <div style={styles.row}>
              <div style={styles.column}>
                About a third of the time the borders will require adjustments.
              </div>

              <div style={styles.column}>
                You can adjust the borders by adjusting the mask/detector
                settings, which simply checks for colors within a range. Each of
                the adjustments has a label to help you out. In this case, we
                want to "include more skin" as it will broaden the search
                parameters.
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.column}>
                <img
                  src={tutorial_non_clean_1}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>

              <div style={styles.column}>
                <img
                  src={tutorial_non_clean_2}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>
            </div>
            <div style={styles.tutorialSingleColumn}>
              The borders are as you see above now.
              <img
                src={tutorial_non_clean_3}
                style={styles.tutorialImage}
                alt=""
              />
            </div>
            <h2>Small wounds</h2>
            <div style={styles.row}>
              <div style={styles.column}>
                Areas too small are automatically filtered out and not shown.
              </div>

              <div style={styles.column}>
                You can adjust the filter to show smaller areas.
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.column}>
                <img
                  src={tutorial_small_wound_1}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>

              <div style={styles.column}>
                <img
                  src={tutorial_small_wound_2}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>
            </div>
            <h2>Short green lines</h2>
            <div style={styles.tutorialSingleColumn}>
              Sometimes due to lighting, not all of the green line is detected.
              You can adjust the width value to account for that.
              <img src={tutorial_short_1} style={styles.tutorialImage} alt="" />
            </div>
            <h2>Split green lines</h2>
            <div style={styles.row}>
              <div style={styles.column}>
                Sometimes, due to lighting, the green line might be split in the
                middle.
              </div>

              <div style={styles.column}>
                You can adjust the detector settings to broaden or restrict the
                search for what counts as the green line.
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.column}>
                <img
                  src={tutorial_split_1_lines}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>

              <div style={styles.column}>
                <img
                  src={tutorial_split_2_edited}
                  style={styles.tutorialImage}
                  alt=""
                />
              </div>
            </div>

            <div style={styles.tutorialSingleColumn}>
              <h2>Manual width</h2>
              Worst case scenario, you can change the width measurement to
              manual to use the image width as reference rather then length of
              the green line. To do so, check the checkbox to convert to manual,
              then crop the image to the desired width.
              <img src={tutorial_crop_1} style={styles.tutorialImage} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
