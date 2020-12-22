import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Components/Home";
import Meetings from "./Components/Meetings";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <PrivateRoute exact path="/meetings" component={Meetings} />
    </BrowserRouter>
  );
}

export default App;
