// You can choose your kind of history here (e.g. browserHistory)
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import MainPage from "./components/MainPage/MainPage";
import HomePage from "./components/HomePage/HomePage";
require("typeface-roboto-slab");
// Your routes.js file

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/main" component={MainPage} exact />
      <Route path="/home" component={HomePage} exact />
      <Redirect from="/" to="/home" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);