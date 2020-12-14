import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Components/Home";
import Meetings from "./Components/Meetings";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route exact path="/meetings" component={Meetings} />
    </BrowserRouter>
  );
}

export default App;
