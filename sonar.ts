namespace Robot.Hardware.Sonar {
    const SONAR_RETRY = 2;
    const SENSOR_INTERVAL_MS = 100;      // 80–120ms is fine
    const MIN_CM = 2;
    const MAX_CM = 300;

    export let frontDistance = 999;
    let lastGood = 999;

    // Configure echo so it doesn't float
    pins.setPull(DigitalPin.P16, PinPullMode.PullDown);

    function pingOnce(trigger: DigitalPin, echo: DigitalPin): number {
        // Optional: tiny settle time
        basic.pause(1);
        let d = sonar.ping(trigger, echo, PingUnit.Centimeters);
        return d > 0 ? d : 0;
    }

    function robustPing(trigger: DigitalPin, echo: DigitalPin): number {
        // quick retries
        let best = 0;
        for (let i = 0; i <= SONAR_RETRY; i++) {
            const d = pingOnce(trigger, echo);
            if (d > 0) { best = d; break; }
            basic.pause(4);
        }
        return best;
    }

    function medianOf3(a: number, b: number, c: number): number {
        const arr = [a, b, c];
        arr.sort((x, y) => x - y);
        return arr[1];
    }

    function readFiltered(trigger: DigitalPin, echo: DigitalPin): number {
        const a = robustPing(trigger, echo);
        const b = robustPing(trigger, echo);
        const c = robustPing(trigger, echo);
        let m = medianOf3(a, b, c);

        // range check + simple hold-last-good
        if (m === 0 || m < MIN_CM || m > MAX_CM) return lastGood;
        lastGood = m;
        return m;
    }

    basic.forever(function () {
        // If PWM is active/noisy, you can skip or delay the ping:
        // if (Robot.Hardware.Motors.motorsRunning) { basic.pause(SENSOR_INTERVAL_MS); return; }

        frontDistance = readFiltered(DigitalPin.P15, DigitalPin.P16);

        // safety stop
        if (Robot.Hardware.Motors.currentDir > 0
            && frontDistance < Robot.Hardware.Motors.SAFE_DISTANCE) {
            Robot.Hardware.Motors.stop();
        }

        basic.pause(SENSOR_INTERVAL_MS);
    });
}