export const day = 1000 * 60 * 60 * 24;

export function toDateString(date: Date) {
    if (date.getTime() === 0)
        return "Never";
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function toTimeString(date: Date, withSeconds?: boolean) {
    const hourMode = "12";

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let hoursStr = "";
    let ampm = "AM";
    let minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    let secondsStr = seconds < 10 ? `0${seconds}` : seconds;

    if (hourMode === "12") {
        if (hours > 12) {
            hours -= 12;
            ampm = "PM";
        }
    }

    hoursStr = `${hours}`;

    return `${hoursStr}:${minutesStr}${withSeconds ? `:${secondsStr}` : ""} ${ampm}`;
}
