import "./styles.css";
import html from "./index.html";

document.title = "Test";
document.querySelector("main")!.innerHTML = html;

const STORE_KEY = "01-test_counter";

let count = +(localStorage.getItem(STORE_KEY) || 0);

const counter = document.getElementById("counter")!;
const clicker = document.getElementById("clicker")!;

function setCount(val = 0) {
  counter.textContent = val.toString();
}

clicker.onclick = () => {
  count++;
  setCount(count);
  localStorage.setItem(STORE_KEY, count.toString());
};

setCount(count);
