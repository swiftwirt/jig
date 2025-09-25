namespace Robot.Core.Dispatcher {
    // ─── COMMAND DEBOUNCING ─────────────────────────────────────────────────────
    let lastCommand = "";
    let lastCommandTime = 0;
    const COMMAND_DEBOUNCE_MS = 150; // Prevent rapid direction changes

    export function dispatch(cmd: string) {
        // Try to parse as JSON settings message first
        if (!tryParseSettingsMessage(cmd)) {
            // Handle existing numeric commands with debouncing
            executeCmdWithDebouncing(cmd);
        }
    }

    function executeCmdWithDebouncing(cmd: string) {
        const currentTime = input.runningTime();
        
        // Allow immediate execution of same command (speed changes, etc.)
        if (cmd === lastCommand) {
            executeCmd(cmd);
            return;
        }
        
        // For direction changes, enforce debouncing
        if (isDirectionCommand(cmd) && isDirectionCommand(lastCommand)) {
            if (currentTime - lastCommandTime < COMMAND_DEBOUNCE_MS) {
                return; // Ignore rapid direction changes
            }
        }
        
        lastCommand = cmd;
        lastCommandTime = currentTime;
        executeCmd(cmd);
    }

    function isDirectionCommand(cmd: string): boolean {
        return cmd === "1" || cmd === "2" || cmd === "5" || cmd === "6" || cmd === "7" || cmd === "8";
    }

    // ─── SETTINGS MESSAGE HANDLING ──────────────────────────────────────────────
    function tryParseSettingsMessage(cmd: string): boolean {
        try {
            // Try to parse as JSON
            const parsed = JSON.parse(cmd);

            // format: {"l":X,"r":Y,"f":Z,"b":W}
            if (parsed && typeof parsed === "object") {
                let processed = false;

                // Process motor speeds if both are provided
                if (typeof parsed.l === "number" && typeof parsed.r === "number") {
                    const leftSpeed = parsed.l;
                    const rightSpeed = parsed.r;

                    // Validate and apply motor speeds
                    if (leftSpeed >= 0 && leftSpeed <= 1023 && rightSpeed >= 0 && rightSpeed <= 1023) {
                        Robot.Hardware.Motors.setMotorSpeeds(leftSpeed, rightSpeed);
                        processed = true;
                    }
                }

                // Process safe distances if both are provided
                if (typeof parsed.f === "number" && typeof parsed.b === "number") {
                    const frontDistance = parsed.f;
                    const backDistance = parsed.b;

                    // Validate and apply safe distances (20-100cm range)
                    if (frontDistance >= 20 && frontDistance <= 100 && backDistance >= 5 && backDistance <= 200) {
                        Robot.Hardware.Motors.setSafeDistances(frontDistance, backDistance);
                        processed = true;
                    }
                }

                return processed;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    function executeCmd(cmd: string) {
        switch (cmd) {
            case "1": Robot.Hardware.Motors.forward(); break;
            case "2": Robot.Hardware.Motors.backward(); break;
            case "3": Robot.Hardware.Motors.spinLeft(); break;
            case "4": Robot.Hardware.Motors.spinRight(); break;
            case "5": Robot.Hardware.Motors.turnLeft(); break;
            case "6": Robot.Hardware.Motors.turnRight(); break;
            case "7": Robot.Hardware.Motors.turnLeftBackward(); break;
            case "8": Robot.Hardware.Motors.turnRightBackward(); break;
            default: Robot.Hardware.Motors.stop(); break;
        }
    }
}