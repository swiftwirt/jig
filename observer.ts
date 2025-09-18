namespace Robot.Observer {
    let cpuTemp = 0;
    let lastCpuTemp = -999;
    let lastFront = -1;
    let lastBack = -1;

    export function sendTelemetry() {
        cpuTemp = input.temperature();

        const changed =
            cpuTemp !== lastCpuTemp ||
            Robot.Hardware.Sonar.frontDistance !== lastFront ||
            Robot.Hardware.Sonar.backDistance !== lastBack;

        if (!changed) return;

        lastCpuTemp = cpuTemp;
        lastFront = Robot.Hardware.Sonar.frontDistance;
        lastBack = Robot.Hardware.Sonar.backDistance;

        let p = {
            cpu: cpuTemp,
            front: Robot.Hardware.Sonar.frontDistance,
            back: Robot.Hardware.Sonar.backDistance
        };

        bluetooth.uartWriteString(JSON.stringify(p) + "\n");
    }
}