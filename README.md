# IoT Robot Jig

A sophisticated micro:bit-based robot with servo-controlled directional sonar, dual motor control, and Bluetooth communication capabilities.

## 🚀 Features

- **Dual Motor Control**: Independent left/right motor control with L298N Mini driver
- **Servo-Controlled Sonar**: Directional obstacle detection (0° forward, 180° backward)
- **Dynamic Configuration**: Adjustable motor speeds and safe distances via Bluetooth
- **Real-time Telemetry**: Live sensor data transmission
- **Safety Systems**: Collision avoidance with configurable thresholds
- **Bluetooth Control**: Remote control via UART commands

## 🔌 Hardware Connections

### Pin Map

```
    micro:bit Pinout
    ┌─────────────────────────┐
    │  P0  P1  P2  P3  P4     │  ← Analog Pins
    │  P5  P6  P7  P8  P9     │  ← Digital Pins
    │ P10 P11 P12 P13 P14     │
    │ P15 P16 P19 P20         │
    └─────────────────────────┘

Pin Assignments:
┌─────────────────────────────────────────────────────────────┐
│  MOTOR DRIVER (L298N Mini)                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ LEFT MOTOR  │    │ RIGHT MOTOR │    │   SERVO     │      │
│  │ P12 - FWD   │    │ P14 - FWD   │    │ P1  - PWM   │      │
│  │ P13 - BWD   │    │ P15 - BWD   │    │             │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                             │
│  SENSORS & DISPLAY                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   SONAR     │    │  DISPLAY    │    │ BLUETOOTH   │      │
│  │ P16 - TRIG  │    │ 5x5 LED     │    │ Built-in    │      │
│  │ P8  - ECHO  │    │ MATRIX      │    │ UART        │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
└─────────────────────────────────────────────────────────────┘

Digital Pins:
  P8  - SONAR_ECHO  (Ultrasonic sensor echo)
  P16 - SONAR_TRIG  (Ultrasonic sensor trigger)

Analog Pins:
  P1  - SERVO_PIN   (Servo motor position control)
  P12 - LEFT_FWD    (Left motor forward PWM)
  P13 - LEFT_BWD    (Left motor backward PWM)
  P14 - RIGHT_FWD   (Right motor forward PWM)
  P15 - RIGHT_BWD   (Right motor backward PWM)

⚠️  LED MATRIX PINS (MAY CAUSE CONFLICTS):
  P3, P4, P6, P7, P9, P10 (Columns)
  P13, P14, P15, P16, P17 (Rows)

⚠️  IMPORTANT: P13, P14, P15, P16 are used by both motors/sonar AND LED matrix.
  This may cause display issues but won't affect motor/sonar functionality.
  If LED display problems occur, consider using alternative pins.
```

### Required Components
- micro:bit v2
- L298N Mini motor driver (4-pin PWM control)
- 2x DC motors with wheels
- Servo motor (SG90 or similar)
- Ultrasonic sensor (HC-SR04)
- Power supply (6-12V for motors)
- Jumper wires and breadboard

### L298N Mini Wiring
The L298N Mini uses a simplified 4-pin PWM control system:
- **P12** → L298N IN1 (Left motor forward)
- **P13** → L298N IN2 (Left motor backward)
- **P14** → L298N IN3 (Right motor forward)
- **P15** → L298N IN4 (Right motor backward)
- **VCC** → 5V power supply
- **GND** → Common ground

## 📡 Bluetooth Commands

### Basic Movement Commands
```
"1" - Forward
"2" - Backward  
"3" - Spin Left
"4" - Spin Right
"5" - Turn Left
"6" - Turn Right
"7" - Turn Left Backward
"8" - Turn Right Backward
"0" - Stop
```

### Advanced Configuration (JSON)
```json
{
  "l": 500,    // Left motor speed (0-1023)
  "r": 500,    // Right motor speed (0-1023)
  "f": 40,     // Front safe distance (20-100cm)
  "b": 20      // Back safe distance (5-200cm)
}
```

## 📊 Telemetry Data

The robot sends real-time telemetry via Bluetooth:
```json
{
  "cpu": 25.5,     // CPU temperature (°C)
  "front": 45,     // Front distance (cm)
  "back": 30       // Back distance (cm)
}
```

## 🏗️ Architecture

### Namespace Structure
```
Robot.Core.Dispatcher    - Command processing
Robot.Core.State         - Global state management
Robot.Core.Events        - Event system
Robot.Hardware.Motors    - Motor control & safety
Robot.Hardware.Servo     - Servo positioning
Robot.Hardware.Sonar     - Distance sensing
Robot.Observer          - Telemetry reporting
Robot.Services.Display   - LED matrix display
Robot.Core.Bluetooth    - Bluetooth communication
```

### Key Features

#### Dynamic Motor Control
- Configurable motor speeds (0-1023)
- Independent left/right speed control
- Smooth acceleration and braking

#### Servo-Controlled Sonar
- **Forward mode**: Servo at 0°, measures front obstacles
- **Backward mode**: Servo at 180°, measures rear obstacles
- **Automatic positioning**: Servo moves based on movement direction
- **Single sonar sensor**: One HC-SR04 sensor with servo-controlled direction
- **Dual distance tracking**: Separate front and back distance measurements

#### Safety Systems
- **Front collision avoidance**: Stops when front distance < safe threshold
- **Rear collision avoidance**: Stops when back distance < safe threshold
- **Configurable thresholds**: Different limits for forward/backward movement
- **Automatic servo positioning**: Servo moves to 0° for forward, 180° for backward
- **Direction-aware sensing**: Sonar measures in the direction of movement

#### Smart Telemetry
- Only sends data when values change (efficient bandwidth usage)
- Real-time distance monitoring
- CPU temperature monitoring

## 🔧 Configuration

### Default Settings
- **Motor Speed**: 1023 (maximum)
- **Front Safe Distance**: 40cm
- **Back Safe Distance**: 40cm
- **Servo Range**: 0° (forward) to 180° (backward)

### Customization
All settings can be modified via Bluetooth JSON commands:
- Motor speeds: `{"l": 500, "r": 500}`
- Safe distances: `{"f": 30, "b": 20}`
- Combined: `{"l": 400, "r": 400, "f": 35, "b": 25}`

## 🚦 Safety Features

1. **Collision Avoidance**: Automatic stop when obstacles detected
2. **Range Validation**: Input validation for all parameters
3. **Safe Defaults**: Conservative default settings
4. **Visual Feedback**: LED matrix shows robot status
5. **Connection Monitoring**: Bluetooth connection status display

## 📱 Usage Examples

### Basic Movement
```javascript
// Connect via Bluetooth and send commands
bluetooth.uartWriteString("1");  // Move forward
bluetooth.uartWriteString("2");  // Move backward
bluetooth.uartWriteString("0");  // Stop
```

### Advanced Control
```javascript
// Set custom motor speeds and safe distances
const config = {
  l: 600,    // Left motor at 60% speed
  r: 600,    // Right motor at 60% speed
  f: 50,     // 50cm front safe distance
  b: 30      // 30cm back safe distance
};
bluetooth.uartWriteString(JSON.stringify(config));
```

## 🔍 Troubleshooting

### Common Issues
1. **Motors not responding**: Check L298N Mini connections and power supply
2. **Sonar not working**: Verify P16 (trigger) and P8 (echo) connections
3. **Servo not moving**: Check P1 servo power and signal connections
4. **Bluetooth not connecting**: Ensure micro:bit is in pairing mode
5. **LED display issues**: P13, P14, P15, P16 are LED matrix pins - may cause conflicts
6. **Servo not responding**: Check P1 connection and servo power (5V)
7. **Distance readings erratic**: Ensure sonar sensor is properly connected to P16/P8

### Debug Information
- LED matrix shows current status
- Telemetry provides real-time sensor data
- Check pin connections against the pin map

## 📄 License

This project is open source. Feel free to modify and distribute according to your needs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

---

**Note**: Always ensure proper power supply for motors and follow safety guidelines when working with electrical components.
