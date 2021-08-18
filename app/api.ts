export type Device = {
  _id: string;
  name: string;
  color: string;
  state: Packet;
};

export type Packet = {
  _id: string;
  time: number | Date;
  temperature: number;
  humidity: number;
};

const token = localStorage.getItem("_token");

export async function send<T = any>(path: string, opts?: RequestInit) {
  opts = opts || {};
  opts.headers = opts.headers || {};

  if (token) {
    opts.headers["authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(path, opts);
  const json = await resp.json();

  if (resp.status >= 300) {
    throw new Error(json.message || resp.statusText);
  }

  return json as T;
}

export async function auth(username: string, password: string) {
  const resp = await send<{ token: string }>("/auth", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "content-type": "application/json",
    },
  });

  localStorage.setItem("_token", resp.token);

  return resp;
}

export function getDevices() {
  return send<Device[]>("ric/api/v1/objects");
}

export function getPackets(id: string, from = 0, to = Date.now()) {
  return send<Packet[]>(
    `ric/api/v1/objects/${id}/packets?from=${from}&to=${to}`
  );
}
