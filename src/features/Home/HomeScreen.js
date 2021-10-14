import React, { useEffect } from "react";

import { base_url, base_ml_url } from "../../constants.js";

import HomeView from "./HomeView";

const HomeScreen = (props) => {
  useEffect(() => {
    //Wake up backend and ml server if offline.
    let form = new FormData();
    form.append("wakeup", "wakeup server");
    let analyze_options = {
      method: "POST",
      body: form,
    };
    fetch(base_url, analyze_options)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .catch((error) => console.log(error));

    fetch(base_ml_url, analyze_options)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .catch((error) => console.log(error));
  }, []);

  const goToSingle = () => {
    props.history.push("/single");
  };

  const goToMulti = () => {
    props.history.push("/multi");
  };
  return <HomeView goToSingle={goToSingle} goToMulti={goToMulti} />;
};

export default HomeScreen;
