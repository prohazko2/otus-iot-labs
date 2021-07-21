const express = require("express");

const db = require("./db");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
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

app.get("/objects", async (req, res) => {
  const all = await db.objects.find();
  res.json(all);
});

app.post("/objects", async (req, res) => {
  const result = await db.objects.insert(req.body);
  res.json(result);
});

app.patch("/objects/:id", async (req, res) => {
  const result = await db.objects.update(
    { _id: req.params.id },
    { $set: req.body },
    { returnUpdatedDocs: true }
  );
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`start http server at http://127.0.0.1:${PORT}/`);
});
