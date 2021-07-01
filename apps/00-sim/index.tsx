import "@wokwi/elements";

import React from "react";
import { render } from "react-dom";

import { AVRRunner } from "./avr/runner";
import { PinState } from "avr8js";

import hex from "./test.ino.hex";

document.title = "AVR8 Simulator";

const avr = new AVRRunner();

avr.loadHex(hex);
avr.execute();

class App extends React.Component {
  state = {
    high: false,
  };

  componentDidMount() {
    avr.portB.addListener(() => {
      const high = avr.portB.pinState(13 - 8) === PinState.High;
      this.setState({ high });
    });
  }

  render() {
    const { high } = this.state;
    return (
      <div>
        <wokwi-arduino-uno led13={high || undefined}></wokwi-arduino-uno>
        <wokwi-led value={high || undefined} color="red" label="13"></wokwi-led>
      </div>
    );
  }
}

render(<App />, document.querySelector("main"));
