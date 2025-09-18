namespace Robot.Core.Bluetooth {
    // ─── BLUETOOTH UART SETUP ───────────────────────────────────────────────────
    const TX_POWER_MAX = 7;
    const NEWLINE = serial.delimiters(Delimiters.NewLine);

    bluetooth.startUartService();
    bluetooth.setTransmitPower(TX_POWER_MAX);

    bluetooth.onBluetoothConnected(() => {
        Robot.Core.State.setConnected(true);
        Robot.Services.Display.showIconIfChanged(IconNames.Heart);
    });

    bluetooth.onBluetoothDisconnected(() => {
        Robot.Core.State.setConnected(false);
        Robot.Services.Display.showIconIfChanged(IconNames.Sad);
    });

    bluetooth.onUartDataReceived(NEWLINE, () => {
        let cmd = bluetooth.uartReadUntil(NEWLINE).trim();
        Robot.Core.Dispatcher.dispatch(cmd);
    });
}