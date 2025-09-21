// ─── PIN ASSIGNMENTS ─────────────────────────────────────────────────────────
// Motor Control (Analog PWM):
//   P12: Left motor forward
//   P13: Left motor backward  
//   P14: Right motor forward
//   P15: Right motor backward

namespace Robot.Hardware.Motors {
    const ARROW_FWD = ArrowNames.South;
    const ARROW_REV = ArrowNames.North;
    const ARROW_SPIN_L = ArrowNames.West;
    const ARROW_SPIN_R = ArrowNames.East;
    const ARROW_TURN_L = ArrowNames.SouthEast;
    const ARROW_TURN_R = ArrowNames.SouthWest;
    const ARROW_TURN_L_REV = ArrowNames.NorthEast;
    const ARROW_TURN_R_REV = ArrowNames.NorthWest;

    const MAX_SPEED = 1023;
    const TURN_SCALE_NUM = 4;
    const TURN_SCALE_DEN = 10;
    export const DEFAULT_SAFE_DISTANCE = 40;
    export const ACTIVE_BRAKE_MS = 100;

    export let motorsRunning = false;
    export let currentDir = 0;        // +1 forward, -1 backward, 0 spin/stop

    // ─── MOTOR SPEED STATE ─────────────────────────────────────────────────────
    let currentLeftSpeed = 0;
    let currentRightSpeed = 0;

    // ─── SAFE DISTANCE STATE ───────────────────────────────────────────────────
    let currentFrontSafeDistance = DEFAULT_SAFE_DISTANCE;
    let currentBackSafeDistance = DEFAULT_SAFE_DISTANCE;

    // ─── INDIVIDUAL MOTOR CONTROL ─────────────────────────────────────────────
    export function setMotorSpeeds(leftSpeed: number, rightSpeed: number) {

        // Validate input parameters
        if (typeof leftSpeed !== "number") {
            leftSpeed = MAX_SPEED;
        } 
        
        if (typeof rightSpeed !== "number") {
            rightSpeed = MAX_SPEED;
        }

        // Clamp speeds to valid range 0-1023
        const clampedLeft = Math.max(0, Math.min(1023, leftSpeed));
        const clampedRight = Math.max(0, Math.min(1023, rightSpeed));

        // Store current speeds
        currentLeftSpeed = clampedLeft;
        currentRightSpeed = clampedRight;
    }

    // ─── GET CURRENT MOTOR SPEEDS ─────────────────────────────────────────────
    export function getCurrentLeftSpeed(): number {
        return currentLeftSpeed;
    }

    export function getCurrentRightSpeed(): number {
        return currentRightSpeed;
    }

    // ─── RESET TO DEFAULT SPEEDS ─────────────────────────────────────────────
    export function resetToDefaultSpeeds() {
        currentLeftSpeed = 0;  // 0 means use MAX_SPEED
        currentRightSpeed = 0; // 0 means use MAX_SPEED
    }

    // ─── CLEAR CUSTOM SPEEDS ─────────────────────────────────────────────────
    export function clearCustomSpeeds() {
        currentLeftSpeed = 0;
        currentRightSpeed = 0;
    }

    // ─── SAFE DISTANCE CONTROL ───────────────────────────────────────────────
    export function setSafeDistances(frontDistance: number, backDistance: number) {
        // Validate input parameters
        if (typeof frontDistance !== "number") {
            frontDistance = DEFAULT_SAFE_DISTANCE;
        }

        if (typeof frontDistance !== "number") {
            backDistance = DEFAULT_SAFE_DISTANCE;
        }

        // Clamp distances to reasonable range 20-100cm
        currentFrontSafeDistance = Math.max(20, Math.min(100, frontDistance));
        currentBackSafeDistance = Math.max(20, Math.min(100, backDistance));
    }

    // ─── GET CURRENT SAFE DISTANCES ──────────────────────────────────────────
    export function getCurrentFrontSafeDistance(): number {
        return currentFrontSafeDistance;
    }

    export function getCurrentBackSafeDistance(): number {
        return currentBackSafeDistance;
    }

    // ─── RESET TO DEFAULT SAFE DISTANCES ─────────────────────────────────────
    export function resetToDefaultSafeDistances() {
        currentFrontSafeDistance = DEFAULT_SAFE_DISTANCE;
        currentBackSafeDistance = DEFAULT_SAFE_DISTANCE;
    }

    // ─── MOTION FUNCTIONS ───────────────────────────────────────────────────────
    export function forward() {
        // Set servo to 0° for forward direction
        Robot.Hardware.Servo.setForward();
        
        if (Robot.Hardware.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        // Use custom speeds if set, otherwise use MAX_SPEED
        const leftSpeed = currentLeftSpeed > 0 ? currentLeftSpeed : MAX_SPEED;
        const rightSpeed = currentRightSpeed > 0 ? currentRightSpeed : MAX_SPEED;

        writeWheels(leftSpeed, 0, rightSpeed, 0);
        Robot.Services.Display.showArrowIfChanged(ARROW_FWD);
        motorsRunning = true;
        currentDir = 1;
    }

    export function backward() {
        // Set servo to 180° for backward direction
        Robot.Hardware.Servo.setBackward();
        
        if (Robot.Hardware.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        // Use custom speeds if set, otherwise use MAX_SPEED
        const leftSpeed = currentLeftSpeed > 0 ? currentLeftSpeed : MAX_SPEED;
        const rightSpeed = currentRightSpeed > 0 ? currentRightSpeed : MAX_SPEED;

        writeWheels(0, leftSpeed, 0, rightSpeed);
        Robot.Services.Display.showArrowIfChanged(ARROW_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    export function spinLeft() {
        // Use custom speeds if set, otherwise use MAX_SPEED
        const leftSpeed = currentLeftSpeed > 0 ? currentLeftSpeed : MAX_SPEED;
        const rightSpeed = currentRightSpeed > 0 ? currentRightSpeed : MAX_SPEED;
        
        writeWheels(leftSpeed, 0, 0, rightSpeed);
        Robot.Services.Display.showArrowIfChanged(ARROW_SPIN_L);
        motorsRunning = true;
        currentDir = 0;
    }

    export function spinRight() {
        // Use custom speeds if set, otherwise use MAX_SPEED
        const leftSpeed = currentLeftSpeed > 0 ? currentLeftSpeed : MAX_SPEED;
        const rightSpeed = currentRightSpeed > 0 ? currentRightSpeed : MAX_SPEED;
        
        writeWheels(0, leftSpeed, rightSpeed, 0);
        Robot.Services.Display.showArrowIfChanged(ARROW_SPIN_R);
        motorsRunning = true;
        currentDir = 0;
    }

    export function turnLeft() {
        // Set servo to 0° for forward direction
        Robot.Hardware.Servo.setForward();
        
        if (Robot.Hardware.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        // Use custom speeds if set, otherwise use MAX_SPEED
        const leftSpeed = currentLeftSpeed > 0 ? currentLeftSpeed : MAX_SPEED;
        const rightSpeed = currentRightSpeed > 0 ? currentRightSpeed : MAX_SPEED;
        const slow = Math.idiv(rightSpeed * TURN_SCALE_NUM, TURN_SCALE_DEN);

        writeWheels(leftSpeed, 0, slow, 0);
        Robot.Services.Display.showArrowIfChanged(ARROW_TURN_L);
        motorsRunning = true;
        currentDir = 1;
    }

    export function turnRight() {
        // Set servo to 0° for forward direction
        Robot.Hardware.Servo.setForward();
        
        if (Robot.Hardware.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        // Use custom speeds if set, otherwise use MAX_SPEED
        const leftSpeed = currentLeftSpeed > 0 ? currentLeftSpeed : MAX_SPEED;
        const rightSpeed = currentRightSpeed > 0 ? currentRightSpeed : MAX_SPEED;
        const slow = Math.idiv(leftSpeed * TURN_SCALE_NUM, TURN_SCALE_DEN);

        writeWheels(slow, 0, rightSpeed, 0);
        Robot.Services.Display.showArrowIfChanged(ARROW_TURN_R);
        motorsRunning = true;
        currentDir = 1;
    }

    export function turnLeftBackward() {
        // Set servo to 180° for backward direction
        Robot.Hardware.Servo.setBackward();
        
        if (Robot.Hardware.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        // Use custom speeds if set, otherwise use MAX_SPEED
        const leftSpeed = currentLeftSpeed > 0 ? currentLeftSpeed : MAX_SPEED;
        const rightSpeed = currentRightSpeed > 0 ? currentRightSpeed : MAX_SPEED;
        const slow = Math.idiv(rightSpeed * TURN_SCALE_NUM, TURN_SCALE_DEN);

        writeWheels(0, leftSpeed, 0, slow);
        Robot.Services.Display.showArrowIfChanged(ARROW_TURN_L_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    export function turnRightBackward() {
        // Set servo to 180° for backward direction
        Robot.Hardware.Servo.setBackward();
        
        if (Robot.Hardware.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        // Use custom speeds if set, otherwise use MAX_SPEED
        const leftSpeed = currentLeftSpeed > 0 ? currentLeftSpeed : MAX_SPEED;
        const rightSpeed = currentRightSpeed > 0 ? currentRightSpeed : MAX_SPEED;
        const slow = Math.idiv(leftSpeed * TURN_SCALE_NUM, TURN_SCALE_DEN);

        writeWheels(0, slow, 0, rightSpeed);
        Robot.Services.Display.showArrowIfChanged(ARROW_TURN_R_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    // ─── LOW-LEVEL MOTOR CONTROL ────────────────────────────────────────────────
    export function writeWheels(Lf: number, Lb: number, Rf: number, Rb: number) {
        pins.analogWritePin(AnalogPin.P12, Lf);
        pins.analogWritePin(AnalogPin.P13, Lb);
        pins.analogWritePin(AnalogPin.P14, Rf);
        pins.analogWritePin(AnalogPin.P15, Rb);
    }

    export function brakePulse() {
        if (!ACTIVE_BRAKE_MS) return;
        
        // Use custom speeds if set, otherwise use MAX_SPEED
        const leftSpeed = currentLeftSpeed > 0 ? currentLeftSpeed : MAX_SPEED;
        const rightSpeed = currentRightSpeed > 0 ? currentRightSpeed : MAX_SPEED;
        const pulse = Math.idiv(((leftSpeed + rightSpeed) / 2), 2);
        
        writeWheels(
            currentDir > 0 ? 0 : pulse,
            currentDir > 0 ? pulse : 0,
            currentDir > 0 ? 0 : pulse,
            currentDir > 0 ? pulse : 0
        );
        basic.pause(ACTIVE_BRAKE_MS);
    }

    export function stop() {
        if (motorsRunning) brakePulse();
        writeWheels(0, 0, 0, 0);
        motorsRunning = false;
        // DON'T reset custom speeds - keep them for next motion command
        // currentLeftSpeed and currentRightSpeed remain unchanged
        Robot.Services.Display.showIconIfChanged(Robot.Core.State.connected ? IconNames.Happy : IconNames.Skull);
    }
}