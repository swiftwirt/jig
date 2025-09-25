namespace Robot.Hardware.Servo {
    // Servo angle constants
    export const FORWARD_ANGLE = 0;    // 3° for forward direction
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
            // Calculate movement time based on angle difference (power-aware timing)
            const angleDiff = Math.abs(clampedAngle - currentAngle);
            let moveTime = 150; // Base time for small movements
            
            // Large movements (like forward->backward) need more time but less than before
            if (angleDiff > 90) {
                moveTime = 200; // Reduced from 300ms to prevent long power draw
            }
            
            servos.P2.setAngle(clampedAngle);
            currentAngle = clampedAngle;
            basic.pause(moveTime);
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