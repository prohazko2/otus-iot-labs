import { createServer as createTcpServer } from "net";
import { createServer as createHttpServer } from "http";

import rest from "./rest";
import mqtt from "./mqtt";

const httpServer = createHttpServer();

httpServer.on("request", rest);

httpServer.listen(3005, () => {
  console.log("http server started");
});

const mqttBroker = createTcpServer(mqtt.handle);

mqttBroker.listen(1883, () => {
  console.log("mqtt broker started");
});
