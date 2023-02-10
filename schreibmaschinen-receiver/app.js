import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connect } from 'mqtt';
import { SerialPort, ReadlineParser } from 'serialport';

let mqttclient = connect("mqtt://mqtt.hfg.design:1883");
const PORT = process.env.PORT || 3002;

let messageEntered = "";
let progressIndex = 0;

let port = new SerialPort({
  path: "COM7",
  baudRate: 9600,
});
let readLine = new ReadlineParser({ delimiter: '\r\n' });
let parser = port.pipe(readLine);

parser.on('data', function (data) {
  console.log(data);
  messageEntered = data;
  progressIndex++;
});

const app = express();
app.use(
  cors({
    origin: '*'
  }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/api", (req, res) => {
  res.json({ messages: arrayOfMessages, progressIndex: progressIndex });
});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

mqttclient.on("connect", function () {
  console.log("client is connected on port:", mqttclient.options.port);
  mqttclient.subscribe("schreibmaschinenkommunikation-sender");
  mqttclient.publish("schreibmaschinenkommunikation-receiver", "Hello, I am the receiver");
});

let arrayOfMessages = [];

mqttclient.on("message", function (topic, message) {
  let responseMsg = message.toString();
  /* if message starts with "NM:" */
  if (responseMsg.indexOf("NM€") == 0) {
    let newMsg = {
      topic: topic,
      message:
        /* characters after "NM:1:" and before next ":" */
        responseMsg.substring(responseMsg.indexOf("NM€1€") + 5, responseMsg.indexOf("€", responseMsg.indexOf("NM€1€") + 5)),
      form:
        /* characters after ":2:" and before next ":" */
        responseMsg.substring(responseMsg.indexOf("€2€") + 3, responseMsg.indexOf("€", responseMsg.indexOf("€2€") + 3)),
      color:

        responseMsg.substring(responseMsg.indexOf("€3€") + 3, responseMsg.indexOf("€", responseMsg.indexOf("€3€") + 3)),
    };
    arrayOfMessages.push(newMsg);
    console.log(arrayOfMessages);
  } else {
    console.log(topic, responseMsg);
  }

});
/* console.log in red  */
/* console.log("\x1b[31m%s\x1b[0m", "POST request received");
 *//* console.log in yellow  */
/* console.log("\x1b[33m%s\x1b[0m", "POST request received"); */
/* console.log in blue  */
/* console.log("\x1b[34m%s\x1b[0m", "POST request received"); */

/* how to act when receiving a post request */
app.post("/api", (req, res) => {
  /* console.log in green  */
  console.log("\x1b[32m%s\x1b[0m", "POST request received: --  '" + req.body.action + "'  --");

  let newMsg = {
    action: req.body.action,
    text: req.body.text,
  }
  if (newMsg.action == "stop") {
    /* newMsg.text = "Gw3yCm4F57zz"; */
    console.log("received stop command");
  }
  if (newMsg.action == "start") {
    messageEntered = newMsg.text;
    newMsg.text = newMsg.text;
    console.log("received start command");
    console.log(arrayOfMessages);
  }
  if (newMsg.action == "delete") {
    arrayOfMessages.splice(req.body.index, 1);
    console.log("received delete command");
    console.log(
      "arrayOfMessages after delete: ",
      arrayOfMessages
    );
  }
  if (newMsg.action == "clear") {
    /* newMsg.text = "Gw3yCm4F57zz"; */
    arrayOfMessages = [];
    console.log("received clear command");
  }
  console.log(newMsg.text);
  port.write(newMsg.text);
  res.json({ state: "POST request received" });
  progressIndex = 0;


});