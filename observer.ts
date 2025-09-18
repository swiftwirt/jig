namespace Robot.Services.Reporter {
    // ─── TELEMETRY ───────────────────────────────────────────────────────────────
    let cpuTemp = 0;
    let ambientTemp = 0;
    let humidity = 0;

    let lastCpuTemp = -999;
    let lastFront = -1;
    let lastAmbient = 999;
    let lastHumidity = 999;

    export function sendTelemetry() {
        cpuTemp = input.temperature();

        const changed =
            cpuTemp !== lastCpuTemp ||
            Robot.Hardware.Sonar.frontDistance !== lastFront ||
            ambientTemp !== lastAmbient ||
            humidity !== lastHumidity;

        if (!changed) return;

        lastCpuTemp = cpuTemp;
        lastFront = Robot.Hardware.Sonar.frontDistance;
        lastAmbient = ambientTemp;
        lastHumidity = humidity;

        let p = {
            cpu: cpuTemp,
            ambient: ambientTemp,
            humidity: humidity,
            front: Robot.Hardware.Sonar.frontDistance
        };

        bluetooth.uartWriteString(JSON.stringify(p) + "\n");
    }
}