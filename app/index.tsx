import React from "react";
import ReactDom from "react-dom";

import "./index.css";

document.title = "Hello";

// const xs = await fetch("ric/api/v1/objects").then((x) => x.json());
// console.log(xs);

const root = document.querySelector("#root");
const page = (
  <div className="app">
    <div className="head">head</div>
    <div className="left">left</div>
    <div className="main">main</div>
  </div>
);

ReactDom.render(page, root);
