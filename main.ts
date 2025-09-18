namespace Robot.Core.State {
    // ─── GLOBAL STATE ─────────────────────────────────────────────────────────
    export let connected = false;
    music.setBuiltInSpeakerEnabled(false)

    export function setConnected(value: boolean) {
        connected = value;
        Robot.Core.Events.emit("connectionChanged", value);
    }
}

namespace Robot.Core.Events {
    // ─── EVENT SYSTEM ─────────────────────────────────────────────────────────
    type EventCallback = (data?: any) => void;
    let listeners: { [event: string]: EventCallback[] } = {};

    export function on(event: string, callback: EventCallback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
    }

    export function emit(event: string, data?: any) {
        if (listeners[event]) {
            for (let callback of listeners[event]) {
                callback(data);
            }
        }
    }
}

// ─── MAIN RUNLOOP ──────────────────────────────────────────────────────
basic.forever(function () {
    if (Robot.Core.State.connected) Robot.Services.Reporter.sendTelemetry();
    basic.pause(1000);
});