// You can choose your kind of history here (e.g. browserHistory)
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "./components/context"
import HomePage from "./components/HomePage/HomePage"
import SingleAnalysisPage from "./components/SingleAnalysisPage/SingleAnalysisPage";
import MultiAnalysisPage from "./components/MultiAnalysisPage/MultiAnalysisPage";
require("typeface-roboto-slab");
// Your routes.js file

ReactDOM.render(
  <Provider>
    <BrowserRouter>
      <Switch>
        <Route path="/single" component={SingleAnalysisPage} exact />
        <Route path="/multi" component={MultiAnalysisPage} exact />
        <Route path="/home" component={HomePage} exact />
        <Redirect from="/" to="/home" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);