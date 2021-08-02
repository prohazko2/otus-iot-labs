import React from "react";
import { render } from "react-dom";

import "./index.css";

document.title = "Hello";

const page = <div>Hello</div>;

render(page, document.querySelector("#root"));
