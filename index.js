const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("nothing to see here yet");
});

app.get("/hello", (req, res) => {
  res.json({ message: "world" });
});

app.all("/echo/:id?", (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    path: req.path,
    params: req.params,
    body: req.body,
    query: req.query,
    headers: req.headers,
  });
});

app.listen(PORT, () => {
  console.log(`start http server at http://127.0.0.1:${PORT}/`);
});
