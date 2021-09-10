import React from "react";
import ReactDom from "react-dom";
import { Device, getDevices, getPackets, Packet } from "./api";

import "./index.css";

document.title = "Hello";

const devices = await getDevices();

function ListItem(props) {
  return (
    <div className={`device ${props.className}`} onClick={props.onClick}>
      <div className="device-id">{props.id}</div>
      <div className="device-name">{props.name}</div>
    </div>
  );
}

function ValueBox(props) {
  return (
    <div className="value-box">
      <div className="value-title">{props.title ?? "Unknown"}</div>
      <div className="value-value">{(props.value ?? "-").toString()}</div>
    </div>
  );
}

type AppState = {
  device: Device;
  packets: Packet[];
};

class App extends React.Component<{}, AppState> {
  state: AppState = {
    device: devices[0],
    packets: [],
  };

  componentDidMount() {
    if (!this.state.packets.length) {
      this.loadPackets(this.state.device);
    }
  }

  setSelected(device: Device) {
    this.setState({ device, packets: [] });
    this.loadPackets(device);
  }

  async loadPackets(device: Device) {
    let packets = await getPackets(device._id);

    packets = packets.sort((a, b) => +a.time - +b.time);
    packets = packets.slice(-1000);

    for (const p of packets) {
      p.time = new Date(p.time);
    }

    this.setState({ packets });
  }

  getDeviceList() {
    return devices.map((dev) => (
      <ListItem
        key={dev._id}
        id={dev._id}
        // name={dev.name}
        className={dev === this.state.device ? "selected" : ""}
        onClick={() => this.setSelected(dev)}
      />
    ));
  }

  render() {
    const packet = (this.state.device?.state ?? {}) as Packet;

    const device_name = (this.state.device?.name);

    return (
      <div className="app">
        <div className="head"></div>
        <div className="left">
          {(
            <span>Список устройств:</span>
          )}
          {this.getDeviceList()}
        </div>
        <div className="main">
          <div className="value-title">
            {(
              <span>Имя выбранного устройства:&nbsp;</span>
            )}
            {device_name}
          </div>
        </div>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("root"));
