namespace Robot.Services.Display {
    // ─── UTILITY DISPLAY ─────────────────────────────────────────────────────────
    let lastDisplayType = "";
    let lastDisplayValue = -1;

    export function showArrowIfChanged(a: ArrowNames) {
        if (lastDisplayType !== "arrow" || lastDisplayValue !== a) {
            basic.showArrow(a);
            lastDisplayType = "arrow";
            lastDisplayValue = a;
        }
    }

    export function showIconIfChanged(i: IconNames) {
        if (lastDisplayType !== "icon" || lastDisplayValue !== i) {
            basic.showIcon(i);
            lastDisplayType = "icon";
            lastDisplayValue = i;
        }
    }
}