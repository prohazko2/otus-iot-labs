import "@wokwi/elements";

import React from "react";
import { render } from "react-dom";

import { AVRRunner } from "./avr";
import { PinState } from "avr8js";

import hex from "./test.ino.hex";

document.title = "AVR8 Simulator";

const avr = new AVRRunner();

avr.loadHex(hex);
avr.execute();

class App extends React.Component {
  state = {
    led: false,
  };

  componentDidMount() {
    avr.portB.addListener(() => {
      this.setState({
        led: avr.portB.pinState(13 - 8) === PinState.High,
      });
    });
  }

  render() {
    const { led } = this.state;
    return (
      <div>
        <wokwi-arduino-uno led13={led || undefined}></wokwi-arduino-uno>
        <wokwi-led value={led || undefined} color="red" label="13"></wokwi-led>
      </div>
    );
  }
}

render(<App />, document.querySelector("main"));
