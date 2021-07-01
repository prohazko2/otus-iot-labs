import { createServer as createTcpServer } from "net";
import { createServer as createHttpServer } from "http";

import rest from "./rest";
import mqtt from "./mqtt";

const ports = {
  http: 3005,
  mqtt: 1883,
};

const httpServer = createHttpServer();

httpServer.on("request", rest);

httpServer.listen(ports.http, () => {
  console.log(`http server started at http://127.0.0.1:${ports.http}/`);
});

const mqttBroker = createTcpServer(mqtt.handle);

mqttBroker.listen(ports.mqtt, () => {
  console.log(`mqtt broker started at mqtt://127.0.0.1:${ports.mqtt}/`);
});
