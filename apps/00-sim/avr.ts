/**
 * AVRRunner
 * Part of AVR8js
 *
 * Copyright (C) 2019, Uri Shaked
 */
import {
  avrInstruction,
  avrInterrupt,
  AVRTimer,
  CPU,
  AVRIOPort,
  AVREEPROM,
  AVRUSART,
  AVRSPI,
  AVRTWI,
  portBConfig,
  portCConfig,
  portDConfig,
  timer0Config,
  timer1Config,
  timer2Config,
  usart0Config,
  spiConfig,
  twiConfig,
} from "avr8js";

// import { Speaker } from "./speaker";
// import { loadHex } from "./intelhex";
import { MicroTaskScheduler } from "./task-scheduler";
import { CPUPerformance } from "./cpu-performance";

// ATmega328p params
const FLASH = 0x8000;

export function loadHex(source: string, target: Uint8Array) {
  for (const line of source.split("\n")) {
    if (line[0] === ":" && line.substr(7, 2) === "00") {
      const bytes = parseInt(line.substr(1, 2), 16);
      const addr = parseInt(line.substr(3, 4), 16);
      for (let i = 0; i < bytes; i++) {
        target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
      }
    }
  }
}

export class AVRRunner {
  readonly program = new Uint16Array(FLASH);
  readonly cpu: CPU;
  readonly timer0: AVRTimer;
  readonly timer1: AVRTimer;
  readonly timer2: AVRTimer;
  readonly portB: AVRIOPort;
  readonly portC: AVRIOPort;
  readonly portD: AVRIOPort;
  //readonly eeprom: AVREEPROM;
  readonly usart: AVRUSART;
  readonly spi: AVRSPI;
  readonly twi: AVRTWI;
  readonly frequency = 16e6; // 16 MHZ
  readonly taskScheduler = new MicroTaskScheduler();
  readonly performance: CPUPerformance;

  // Serial buffer
  private serialBuffer: any = [];

  // Cycles
  private cyclesToRun: number | undefined;
  private workSyncCycles: number = 1;
  private workUnitCycles: number = 100000;
  private syncCycles: number = 1;

  constructor() {
    this.cpu = new CPU(this.program, FLASH);

    this.performance = new CPUPerformance(this.cpu, this.frequency);

    this.timer0 = new AVRTimer(this.cpu, timer0Config);
    this.timer1 = new AVRTimer(this.cpu, timer1Config);
    this.timer2 = new AVRTimer(this.cpu, timer2Config);

    this.portB = new AVRIOPort(this.cpu, portBConfig);
    this.portC = new AVRIOPort(this.cpu, portCConfig);
    this.portD = new AVRIOPort(this.cpu, portDConfig);

    //this.eeprom = new AVREEPROM(this.cpu, new EEPROMLocalStorageBackend());
    this.usart = new AVRUSART(this.cpu, usart0Config, this.frequency);
    this.spi = new AVRSPI(this.cpu, spiConfig, this.frequency);
    this.twi = new AVRTWI(this.cpu, twiConfig, this.frequency);
    //this.speaker = new Speaker(this.cpu, this.frequency);

    this.serialOnLineTransmit();
    this.cpu.readHooks[usart0Config.UDR] = () => this.serialBuffer.shift() || 0;

    this.taskScheduler.start();
  }

  // Function to send data to the serial port
  serialWrite(value: string) {
    // Writing to UDR transmits the byte
    [...value].forEach((c) => {
      // Write a character
      this.serialBuffer.push(c.charCodeAt(0));
    });
  }

  serialOnLineTransmit() {
    // Serial port to browser console
    this.usart.onLineTransmit = (line) => {
      console.log("[Serial] %c%s", "color: red", line);
    };
  }

  rxCompleteInterrupt() {
    const UCSRA = this.cpu.data[usart0Config.UCSRA];

    if (UCSRA & 0x20 && this.serialBuffer.length > 0) {
      avrInterrupt(this.cpu, usart0Config.rxCompleteInterrupt);
    }
  }

  setSyncCycles(factor: number) {
    this.syncCycles = factor;
  }

  getSyncCycles() {
    return this.syncCycles;
  }

  // CPU main loop
  execute(callback?: (cpu: CPU) => void) {
    const speed = this.performance.update();

    // Execution throttling
    if (speed > 1.02) {
      this.workSyncCycles *= Math.ceil((1 / speed) * 100) / 100;
    } else {
      // Adjust gain to balance cycles
      this.workSyncCycles = this.getSyncCycles();
    }

    this.cyclesToRun =
      this.cpu.cycles + this.workUnitCycles * this.workSyncCycles;

    while (this.cpu.cycles < this.cyclesToRun) {
      // Instruction timing is currently based on ATmega328p
      avrInstruction(this.cpu);

      this.cpu.tick();

      // Serial complete interrupt
      if (this.cpu.interruptsEnabled) {
        this.rxCompleteInterrupt();
      }
    }

    callback && callback(this.cpu);

    this.taskScheduler.postTask(() => this.execute(callback));
  }

  stop() {
    this.taskScheduler.stop();
  }

  analogPort() {
    // Simulate analog port (so that analogRead() eventually return)
    this.cpu.writeHooks[0x7a] = (value) => {
      if (value & (1 << 6)) {
        // random value
        const analogValue = Math.floor(Math.random() * 1024);

        this.cpu.data[0x7a] = value & ~(1 << 6); // Clear bit - conversion done
        this.cpu.data[0x78] = analogValue & 0xff;
        this.cpu.data[0x79] = (analogValue >> 8) & 0x3;

        return true; // Don't update
      }
    };
  }

  loadHex(hex: string) {
    loadHex(hex, new Uint8Array(this.program.buffer));
  }

  async loadHexFromUrl(url: string) {
    const resp = await fetch(url);
    const hex = await resp.text();
    this.loadHex(hex);
  }
}
