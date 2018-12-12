const WebSocket = require('ws');
const express = require('express');
const AWS = require('aws-sdk');

S3_REGION = ""
AWS_ACCESS_KEY_ID = ""
AWS_SECRET_ACCESS_KEY = ""

AWS.config.update({ accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY })

const s3 = new AWS.S3();
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: S3_REGION
})

const playSound = (ws, text, title) => {
  let params = {
    'Text': title + ', ' + text,
    'OutputFormat': 'mp3',
    'VoiceId': 'Geraint'
  }

  Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.log(err.message)
    } else if (data) {
      let s3params = {
        Body: data.AudioStream,
        Bucket: '',
        Key: `${text}.mp3`,
        ACL: "public-read"
      };

      s3.upload(s3params, function(err, data) {
        if (err) {
          console.log(err.message);
        } else {
          ws.send(`{"channel": "api-speech", "title": "${title}", "text": "${text}", "soundUrl": "${data.Location}"}`);
        }
      });
    }
  })
}

const wss = new WebSocket.Server({ port: 8765 });

const app = express()
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})
app.listen(process.env.PORT || 8999, function () {
  console.log('ws mock app listening started!')
})

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    const msg = JSON.parse(message);
    playSound(ws, msg, "Your message:")
  });

  playSound(ws, "warrior from the frontend guild", "Greetings");
  setTimeout(() => {
    playSound(ws, "did you learn last week?", "How many frameworks")
  }, 600)
  setTimeout(() => {
    playSound(ws, "POWER", "JS")
  }, 1700)
});
