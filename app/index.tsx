import React from "react";
import ReactDom from "react-dom";

import "./index.css";

document.title = "Hello";

const root = document.querySelector("#root");
const page = <div>Hello</div>;

ReactDom.render(page, root);
