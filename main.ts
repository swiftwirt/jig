// ─── ROBOT PIN MAP ───────────────────────────────────────────────────────────
/*
HARDWARE CONNECTIONS:
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MICRO:BIT PINOUT                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  MOTOR DRIVER (L298N Mini)                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│  │ LEFT MOTOR  │    │ RIGHT MOTOR │    │   SERVO     │                    │
│  │ P12 - FWD   │    │ P14 - FWD   │    │ P1  - PWM   │                    │
│  │ P13 - BWD   │    │ P15 - BWD   │    │             │                    │
│  └─────────────┘    └─────────────┘    └─────────────┘                    │
│                                                                             │
│  SENSORS & DISPLAY                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│  │   SONAR     │    │  DISPLAY    │    │ BLUETOOTH   │                    │
│  │ P16 - TRIG  │    │ 5x5 LED     │    │ Built-in    │                    │
│  │ P8  - ECHO  │    │ MATRIX      │    │ UART        │                    │
│  └─────────────┘    └─────────────┘    └─────────────┘                    │
│                                                                             │
│  COMMUNICATION                                                              │
│  ┌─────────────┐                                                           │
│  │ BLUETOOTH   │                                                           │
│  │ Built-in    │                                                           │
│  │ UART        │                                                           │
│  └─────────────┘                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

PIN ASSIGNMENTS:
Digital Pins:
  P8  - SONAR_ECHO  (Ultrasonic sensor echo)
  P16 - SONAR_TRIG  (Ultrasonic sensor trigger)

Analog Pins:
  P1  - SERVO_PIN   (Servo motor position control)
  P12 - LEFT_FWD    (Left motor forward PWM)
  P13 - LEFT_BWD    (Left motor backward PWM)
  P14 - RIGHT_FWD   (Right motor forward PWM)
  P15 - RIGHT_BWD   (Right motor backward PWM)

LED MATRIX PINS (AVOID):
  P3, P4, P6, P7, P9, P10 (Columns)
  P13, P14, P15, P16, P17 (Rows)

FEATURES:
- Dual motor control with H-bridge drivers
- Servo-controlled directional sonar (0° forward, 180° backward)
- Bluetooth UART communication
- Dynamic motor speeds and safe distances
- Real-time telemetry reporting
- Safety collision avoidance
*/

namespace Robot.Core.State {
    // ─── GLOBAL STATE ─────────────────────────────────────────────────────────
    export let connected = false;

    export function setConnected(value: boolean) {
        connected = value;
        Robot.Core.Events.emit("connectionChanged", value);
    }
}

namespace Robot.Core.Events {
    // ─── EVENT SYSTEM ─────────────────────────────────────────────────────────
    type EventCallback = (data?: any) => void;
    let listeners: { [event: string]: EventCallback[] } = {};

    export function on(event: string, callback: EventCallback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
    }

    export function emit(event: string, data?: any) {
        if (listeners[event]) {
            for (let callback of listeners[event]) {
                callback(data);
            }
        }
    }
}

// ─── MAIN RUNLOOP ──────────────────────────────────────────────────────
Robot.Hardware.Servo.setIdle();
Robot.Services.Display.showIconIfChanged(IconNames.Happy);

basic.forever(function () {
    if (Robot.Core.State.connected) Robot.Observer.sendTelemetry();
    basic.pause(1000);
});