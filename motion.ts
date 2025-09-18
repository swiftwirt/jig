namespace Robot.Hardware.Motors {
    // Motor driver pin assignments (new H-bridge configuration)
    const STBY = DigitalPin.P8;
    const LEFT_PWM = AnalogPin.P0;
    const LEFT_IN1 = DigitalPin.P1;
    const LEFT_IN2 = DigitalPin.P2;
    const RIGHT_PWM = AnalogPin.P14;
    const RIGHT_IN1 = DigitalPin.P12;
    const RIGHT_IN2 = DigitalPin.P13;

    const ARROW_FWD = ArrowNames.North;
    const ARROW_REV = ArrowNames.South;
    const ARROW_SPIN_L = ArrowNames.West;
    const ARROW_SPIN_R = ArrowNames.East;
    const ARROW_TURN_L = ArrowNames.NorthWest;
    const ARROW_TURN_R = ArrowNames.NorthEast;
    const ARROW_TURN_L_REV = ArrowNames.SouthWest;
    const ARROW_TURN_R_REV = ArrowNames.SouthEast;

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
        if (Robot.Hardware.Sonar.frontDistance < SAFE_DISTANCE) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        writeWheels(MAX_SPEED_L, 0, MAX_SPEED_R, 0);
        Robot.Services.Display.showArrowIfChanged(ARROW_FWD);
        motorsRunning = true;
        currentDir = 1;
    }

    export function backward() {
        if (Robot.Hardware.Sonar.frontDistance < SAFE_DISTANCE) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        writeWheels(0, MAX_SPEED_L, 0, MAX_SPEED_R);
        Robot.Services.Display.showArrowIfChanged(ARROW_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    export function spinLeft() {
        writeWheels(MAX_SPEED_L, 0, 0, MAX_SPEED_R);
        Robot.Services.Display.showArrowIfChanged(ARROW_SPIN_L);
        motorsRunning = true;
        currentDir = 0;
    }

    export function spinRight() {
        writeWheels(0, MAX_SPEED_L, MAX_SPEED_R, 0);
        Robot.Services.Display.showArrowIfChanged(ARROW_SPIN_R);
        motorsRunning = true;
        currentDir = 0;
    }

    export function turnLeft() {
        if (Robot.Hardware.Sonar.frontDistance < SAFE_DISTANCE) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const slow = Math.idiv(MAX_SPEED_L * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(slow, 0, MAX_SPEED_R, 0);
        Robot.Services.Display.showArrowIfChanged(ARROW_TURN_L);
        motorsRunning = true;
        currentDir = 1;
    }

    export function turnRight() {
        if (Robot.Hardware.Sonar.frontDistance < SAFE_DISTANCE) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const slow = Math.idiv(MAX_SPEED_R * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(MAX_SPEED_R, 0, slow, 0);
        Robot.Services.Display.showArrowIfChanged(ARROW_TURN_R);
        motorsRunning = true;
        currentDir = 1;
    }

    export function turnLeftBackward() {
        if (Robot.Hardware.Sonar.frontDistance < SAFE_DISTANCE) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const slow = Math.idiv(MAX_SPEED_L * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(0, slow, 0, MAX_SPEED_R);
        Robot.Services.Display.showArrowIfChanged(ARROW_TURN_L_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    export function turnRightBackward() {
        if (Robot.Hardware.Sonar.frontDistance < SAFE_DISTANCE) {
            stop(); Robot.Services.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const slow = Math.idiv(MAX_SPEED_R * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(0, MAX_SPEED_L, 0, slow);
        Robot.Services.Display.showArrowIfChanged(ARROW_TURN_R_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    // ─── LOW-LEVEL MOTOR CONTROL ────────────────────────────────────────────────
    export function writeWheels(Lf: number, Lb: number, Rf: number, Rb: number) {
        // Enable motor driver
        pins.digitalWritePin(STBY, 1);

        // Left motor control
        if (Lf > 0) {
            pins.digitalWritePin(LEFT_IN1, 1);
            pins.digitalWritePin(LEFT_IN2, 0);
            pins.analogWritePin(LEFT_PWM, Lf);
        } else if (Lb > 0) {
            pins.digitalWritePin(LEFT_IN1, 0);
            pins.digitalWritePin(LEFT_IN2, 1);
            pins.analogWritePin(LEFT_PWM, Lb);
        } else {
            pins.digitalWritePin(LEFT_IN1, 0);
            pins.digitalWritePin(LEFT_IN2, 0);
            pins.analogWritePin(LEFT_PWM, 0);
        }

        // Right motor control
        if (Rf > 0) {
            pins.digitalWritePin(RIGHT_IN1, 1);
            pins.digitalWritePin(RIGHT_IN2, 0);
            pins.analogWritePin(RIGHT_PWM, Rf);
        } else if (Rb > 0) {
            pins.digitalWritePin(RIGHT_IN1, 0);
            pins.digitalWritePin(RIGHT_IN2, 1);
            pins.analogWritePin(RIGHT_PWM, Rb);
        } else {
            pins.digitalWritePin(RIGHT_IN1, 0);
            pins.digitalWritePin(RIGHT_IN2, 0);
            pins.analogWritePin(RIGHT_PWM, 0);
        }
    }

    export function brakePulse() {
        if (!ACTIVE_BRAKE_MS) return;
        const pulse = Math.idiv(((MAX_SPEED_L + MAX_SPEED_R) / 2), 2);
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
        // Disable motor driver and set all outputs to 0
        pins.digitalWritePin(STBY, 0);
        pins.digitalWritePin(LEFT_IN1, 0);
        pins.digitalWritePin(LEFT_IN2, 0);
        pins.analogWritePin(LEFT_PWM, 0);
        pins.digitalWritePin(RIGHT_IN1, 0);
        pins.digitalWritePin(RIGHT_IN2, 0);
        pins.analogWritePin(RIGHT_PWM, 0);
        motorsRunning = false;
        Robot.Services.Display.showIconIfChanged(Robot.Core.State.connected ? IconNames.Happy : IconNames.Skull);
    }

    // ─── MOTION TESTS ────────────────────────────────────────────────────────────
    export function runTests(): boolean {
        let passed = 0;
        let total = 0;

        // Test 1: Stop function works
        total++;
        stop();
        if (!motorsRunning) passed++;

        // Test 2: Constants are correct
        total++;
        if (SAFE_DISTANCE === 40 && ACTIVE_BRAKE_MS === 100) passed++;

        // Test 3: Direction tracking works
        total++;
        stop();
        if (currentDir === 0) passed++;

        // Test 4: Motor functions exist and don't crash
        total++;
        try {
            forward();
            basic.pause(50);
            stop();
            backward();
            basic.pause(50);
            stop();
            spinLeft();
            basic.pause(50);
            stop();
            spinRight();
            basic.pause(50);
            stop();
            passed++;
        } catch (e) {
            // Function calls failed
        }

        basic.showString(`M:${passed}/${total}`);
        return passed === total;
    }
}