import { SerialPort, ReadlineParser } from "serialport";
import { connect } from "mqtt";
let mqttclient = connect("mqtt://mqtt.hfg.design:1883");

let port = new SerialPort({
    path: "COM3",
    baudRate: 9600,
});

let readLine = new ReadlineParser({ delimiter: "\r\n" });

let parser = port.pipe(readLine);

parser.on("data", function (data) {
    mqttclient.publish("iot2projekta", data);
    /* console.log(data.toString()); */
});

mqttclient.on("connect", function () {
    console.log("client is connected");
    mqttclient.subscribe("iot2projekta");
});

mqttclient.on("message", function (topic, message) {
    let responseMsg = message.toString();
    console.log("mqtt", responseMsg);

    port.write(responseMsg + "\n");
});