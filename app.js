const express = require("express");
const bodyParser = require("body-parser");
const { connect } = require("mqtt");
let mqttclient = connect("mqtt://mqtt.hfg.design:1883");


let messageEntered = "";

/* let { SerialPort, ReadlineParser } = require('serialport');

let port = new SerialPort({
    path: "COM11",
    baudRate: 9600,
});
let readLine = new ReadlineParser({ delimiter: '\r\n' });
let parser = port.pipe(readLine);

parser.on('data', function (data) {
    console.log(data);
    messageEntered = data;
}); */




mqttclient.on("connect", function () {
    console.log("client is connected on port:", mqttclient.options.port);
    mqttclient.subscribe("schreibmaschinenkommunikation-receiver");
    mqttclient.publish("schreibmaschinenkommunikation-sender", "Hello, I am the sender");
});

mqttclient.on("message", function (topic, message) {
    let responseMsg = message.toString();
    console.log(topic, responseMsg);

});

var cors = require('cors');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(
    cors({
        origin: '*'
    }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get("/api", (req, res) => {
    res.json({ message: messageEntered || "" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.post('/post', (req, res) => {
    console.log('Got body:', req.body);
    console.log(req.body.form);
    switch (req.body.form) {
        case "mqtt":
            mqttclient.publish("schreibmaschinenkommunikation-sender", "NM€1€" + req.body.text + "€2€" + req.body.form + "€3€" + req.body.color + "€");
            break;
        /*         case "visible_light":
                    port.write("NM€1€" + req.body.text + "€2€" + req.body.form + "€3€" + req.body.color + "€");
                    break;
                case "infrared":
                    port.write("NM€1€" + req.body.text + "€2€" + req.body.form + "€3€" + req.body.color + "€");
                    break; */
    }
    res.sendStatus(200);
});