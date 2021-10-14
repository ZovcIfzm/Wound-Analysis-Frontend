// You can choose your kind of history here (e.g. browserHistory)
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "./features/analysis/analysisContext";
import HomeScreen from "./features/Home/screens/HomeScreen";
import SingleAnalysisScreen from "./features/analysis/screens/SingleAnalysisScreen";
import MultiAnalysisScreen from "./features/analysis/screens/MultiAnalysisScreen";
require("typeface-roboto-slab");
// Your routes.js file

ReactDOM.render(
  <Provider>
    <BrowserRouter>
      <Switch>
        <Route path="/single" component={SingleAnalysisScreen} exact />
        <Route path="/multi" component={MultiAnalysisScreen} exact />
        <Route path="/home" component={HomeScreen} exact />
        <Redirect from="/" to="/home" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
