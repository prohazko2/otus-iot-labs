import express from "express";
import { json as parseJson, urlencoded as parseData } from "body-parser";
import type { ErrorRequestHandler } from "express";

import mqtt from "./mqtt";

const app = express();

app.set("json spaces", 2);

app.use(parseData({ extended: true }));
app.use(parseJson({ type: "*/*" }));

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

app.get("/", (req, res) => {
  res.send("test");
});

app.get("/test", (req, res) => {
  res.json({
    clients: Object.values(mqtt.clients).map((x) => {
      return {
        id: x.id,
        v: x.version,
        subscriptions: x.subscriptions,
      };
    }),
  });
});

// global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(new Date().toISOString(), "[error]", err);
    res.status(500);
    res.json({ ok: false, ...err, message: err.message });
  }
);

export default app;
