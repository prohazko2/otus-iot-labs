import React from "react";
import ReactDom from "react-dom";
import { Device, getDevices, getPackets, Packet } from "./api";

import "./index.css";

document.title = "Hello";

const devices = await getDevices();

function ListItem(props) {
  return (
    <div className={`device ${props.className}`} onClick={props.onClick}>
      <div className="device-id">{props.dev._id}</div>
      <div className="device-name">{props.dev.name}</div>
    </div>
  );
}

type AppState = {
  devices: Device[];
  selected: Device;
  packets: Packet[];
};

class App extends React.Component {
  state = {
    devices,
    selected: devices[0],
    packets: [],
  } as AppState;

  componentDidMount() {
    if (!this.state.packets.length) {
      this.setSelected(this.state.selected);
    }
  }

  async setSelected(dev: Device) {
    this.setState({ selected: dev, packets: [] });
    console.log("selected", dev);
    // const packets = await getPackets(dev._id, 0, Date.now());

    // this.setState({ packets });
    // console.log(packets);
  }

  render() {
    const deviceList = this.state.devices.map((dev) => (
      <ListItem
        key={dev._id}
        dev={dev}
        className={`${dev === this.state.selected ? "selected" : ""}`}
        onClick={() => this.setSelected(dev)}
      />
    ));

    const packetList = this.state.packets.map((packet) => (
      <tr>
        <td>{new Date(packet.time).toISOString()}</td>
        <td>{packet.temperature}</td>
      </tr>
    ));

    return (
      <div className="app">
        <div className="head">head</div>
        <div className="left">{deviceList}</div>
        <div className="main">
          <table>{packetList}</table>
        </div>
      </div>
    );
  }
}

ReactDom.render(<App />, document.querySelector("#root"));
