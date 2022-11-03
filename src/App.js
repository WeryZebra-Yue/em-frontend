import React from "react";

import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Containers/Home";
import Root from "./Containers/Root";
import Add from "./Containers/Add";
import { uploadImage } from "./Services/storage.service";
import Open from "./Containers/Open";
import Edit from "./Containers/Edit";
import Admin from "./Containers/Admin";

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/dashboard">
          <Root />
        </Route>
        <Route exact path="/add">
          <Add />
        </Route>
        <Route exact path="/open">
          <Open />
        </Route>
        <Route exact path="/edit">
          <Edit />
        </Route>
        <Route exact path="/admin">
          <Admin />
        </Route>
        <Route exact path="/*">
          <div
            style={{
              width: "100vw",
              display: "flex",
              color: "white",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              background: "#5c2b2b",
              height: "100vh",
            }}
          >
            No, Page here 404 <br />
            Where are you wondring to?
          </div>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
