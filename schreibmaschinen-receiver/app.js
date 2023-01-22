import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connect } from 'mqtt';

let mqttclient = connect("mqtt://mqtt.hfg.design:1883");
const PORT = process.env.PORT || 3002;

const app = express();
app.use(
  cors({
    origin: '*'
  }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/api", (req, res) => {
  res.json({ messages: arrayOfMessages });
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
        /* characters after ":3:" and before next ":" */
        responseMsg.substring(responseMsg.indexOf("€3€") + 3, responseMsg.indexOf("€", responseMsg.indexOf("€3€") + 3)),
    };
    arrayOfMessages.push(newMsg);
    console.log(arrayOfMessages);
  } else {
    console.log(topic, responseMsg);
  }

});