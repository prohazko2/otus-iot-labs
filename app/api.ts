export type Device = {
  _id: string;
  name: string;
  color: string;
};

export type Packet = {
  _id: string;
  time: number;
  temperature: string;
};

export function getDevices(): Promise<Device[]> {
  return fetch("ric/api/v1/objects").then((resp) => resp.json());
}

export function getPackets(
  id: string,
  from: number,
  to: number
): Promise<Packet[]> {
  return fetch(`ric/api/v1/objects/${id}/packets?from=${from}&to=${to}`).then(
    (resp) => resp.json()
  );
}
