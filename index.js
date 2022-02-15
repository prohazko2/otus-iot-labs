const express = require("express");

const db = require("./db");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("json spaces", 2);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method.padStart(5)} ${req.url}`);
  next();
});

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

app.patch("/devices/:id", (req, res) => {
  const result = db.devices.update(req.params.id, req.body);
  res.json(result);
});

app.delete("/devices/:id", (req, res) => {
  const result = db.devices.remove(req.params.id);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`start http server at http://127.0.0.1:${PORT}/`);
});
