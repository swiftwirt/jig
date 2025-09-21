namespace Robot.Hardware.Servo {
    // Servo angle constants
    export const FORWARD_ANGLE = 3;    // 3° for forward direction
    export const BACKWARD_ANGLE = 173; // 173° for backward direction
    const IDLE_ANGLE = 83;
    
    // Current servo angle
    export let currentAngle = IDLE_ANGLE;
    
    // ─── SERVO CONTROL ─────────────────────────────────────────────────────────
    function setAngle(angle: number) {
        // Validate angle range (0-180 degrees)
        const clampedAngle = Math.max(0, Math.min(180, angle));
        
        // Only move servo if angle actually changed
        if (clampedAngle !== currentAngle) {
            servos.P1.setAngle(clampedAngle);
            currentAngle = clampedAngle;
            // Give servo time to move to new position
            basic.pause(300);
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
    
    // ─── SERVO STATE QUERIES ───────────────────────────────────────────────────
    export function isServoMoving(): boolean {
        return false; // Simple version - no moving state
    }
}