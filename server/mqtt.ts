import aedes, { Aedes, Client } from "aedes";

const server = aedes({});

type _Client = Client & {
  subscriptions: Record<string, any>;
};

type Server = Aedes & {
  clients: Record<string, _Client>;
};

server.on("client", (client) => {
  console.log("client", client.id);

  //client.on('')
});

server.on("publish", (packet, client) => {
  if (!client) {
    return;
  }
  console.log("publish: ", client.id, packet.topic, packet.payload.toString());
});

export default server as Server;
