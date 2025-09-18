namespace Robot.Hardware.Servo {
    // Servo pin assignment (avoiding LED matrix and BLE pins)
    const SERVO_PIN = AnalogPin.P1;  // Using P1 for servo (avoiding P0 which conflicts with BLE)
    
    // Servo angle constants
    const FORWARD_ANGLE = 0;    // 0° for forward direction
    const BACKWARD_ANGLE = 180; // 180° for backward direction
    
    // Current servo angle
    let currentAngle = FORWARD_ANGLE;
    
    // ─── SERVO CONTROL ─────────────────────────────────────────────────────────
    export function setAngle(angle: number) {
        // Validate angle range (0-180 degrees)
        const clampedAngle = Math.max(0, Math.min(180, angle));
        
        // Set servo angle
        pins.servoWritePin(SERVO_PIN, clampedAngle);
        currentAngle = clampedAngle;
    }
    
    // ─── CONVENIENCE FUNCTIONS ────────────────────────────────────────────────
    export function setForward() {
        setAngle(FORWARD_ANGLE);
    }
    
    export function setBackward() {
        setAngle(BACKWARD_ANGLE);
    }
    
    // ─── GET CURRENT ANGLE ────────────────────────────────────────────────────
    export function getCurrentAngle(): number {
        return currentAngle;
    }
    
    // ─── RESET TO FORWARD ─────────────────────────────────────────────────────
    export function resetToForward() {
        setAngle(FORWARD_ANGLE);
    }
}