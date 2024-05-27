// AT Command Send
function sendAtCmd (cmd: string) {
    serial.writeString("" + cmd + "\u000D\u000A")
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    sendAtCmd("AT+CIPCLOSE")
    if (grove.wifiOK()) {
        basic.showIcon(IconNames.Heart)
    } else {
        basic.showIcon(IconNames.Sad)
    }
})
grove.setupWifi(
SerialPin.C17,
SerialPin.C16,
BaudRate.BaudRate115200,
"komsomolsk",
"vikaschnika"
)
if (grove.wifiOK()) {
    basic.showIcon(IconNames.Heart)
}
function sendDataToThingsboard(data: any) {
    const serverAddress = "paminasogo.ddns.net";
    const serverPort = 9090;
    const accessToken = "wV0EikPcEMHcE3u3zvgI";
    const payload = JSON.stringify(data);
    const request = `POST /api/v1/${accessToken}/telemetry HTTP/1.1\r\n` +
        `Host: ${serverAddress}\r\n` +
        `Content-Type: application/json\r\n` +
        `Content-Length: ${payload.length}\r\n\r\n` +
        `${payload}`;

    serial.writeString(`AT+CIPSTART="TCP","${serverAddress}",${serverPort}\r\n`);
    basic.pause(2000);
    serial.writeString(`AT+CIPSEND=${request.length}\r\n`);
    basic.pause(2000);
    serial.writeString(request);
    basic.pause(2000);
    serial.writeString("AT+CIPCLOSE\r\n");
}
basic.forever(function () {
    const dataToSend = {
        temperature: input.temperature()  // Grove-Temperatursensor verwenden
    };
sendDataToThingsboard(dataToSend);
basic.pause(60000)
})
