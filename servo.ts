namespace Robot.Hardware.Servo {
    // Servo angle constants
    export const FORWARD_ANGLE = 3;    // 3° for forward direction
    export const BACKWARD_ANGLE = 173; // 173° for backward direction
    const IDLE_ANGLE = 83;
    
    // Current servo angle
    export let currentAngle = FORWARD_ANGLE;
    
    // Servo state tracking
    let targetAngle = FORWARD_ANGLE;
    let isMoving = false;
    let moveStartTime = 0;
    const SERVO_MOVE_TIME_MS = 500; // Time for servo to complete movement
    
    // ─── SERVO STATE UPDATE ────────────────────────────────────────────────────
    function updateServoState() {
        if (isMoving) {
            const elapsed = input.runningTime() - moveStartTime;
            if (elapsed >= SERVO_MOVE_TIME_MS) {
                // Servo movement completed
                currentAngle = targetAngle;
                isMoving = false;
            }
        }
    }
    
    // ─── SERVO CONTROL ─────────────────────────────────────────────────────────
    function setAngle(angle: number) {
        // Validate angle range (0-180 degrees)
        const clampedAngle = Math.max(0, Math.min(180, angle));
        
        // Only move servo if angle actually changed and not currently moving
        if (clampedAngle !== currentAngle && !isMoving) {
            servos.P1.setAngle(clampedAngle);
            targetAngle = clampedAngle;
            isMoving = true;
            moveStartTime = input.runningTime();
        }
    }
    
    // ─── CONVENIENCE FUNCTIONS ────────────────────────────────────────────────
    export function setForward() {
        setAngle(FORWARD_ANGLE);
    }
    
    export function setBackward() {
        setAngle(BACKWARD_ANGLE);
    }

    export function setIdle() {
        setAngle(IDLE_ANGLE);
    }
    
    // ─── GET CURRENT ANGLE ────────────────────────────────────────────────────
    export function getCurrentAngle(): number {
        return currentAngle;
    }
    
    // ─── RESET TO FORWARD ─────────────────────────────────────────────────────
    export function resetToForward() {
        setAngle(FORWARD_ANGLE);
    }
    
    // ─── SERVO STATE MANAGEMENT ────────────────────────────────────────────────
    export function update() {
        updateServoState();
    }
    
    export function isServoMoving(): boolean {
        return isMoving;
    }
    
    export function getTargetAngle(): number {
        return targetAngle;
    }
}