const express = require("express");

const db = require("./db");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("json spaces", 2);

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.all("/echo/:id?", (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    path: req.path,
    params: req.params,
    query: req.query,
    headers: req.headers,
    body: req.body,
  });
});

app.get("/devices", (req, res) => {
  const all = db.devices.find();
  res.json(all);
});

app.post("/devices", (req, res) => {
  const result = db.devices.insert(req.body);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`start http server at http://127.0.0.1:${PORT}/`);
});
