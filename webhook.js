var express = require('express'), bodyParser = require('body-parser'), request = require('request'), app = express().use(bodyParser.json());

//token for facebook app
const app_token = 'EAAbnH2RGIhYBAPUToCP5HUhl0gYCzMUtL9na3JpZB1B54TxuAr4dKY1wGPQetLj7YMS7eaerayEV3z1aZABkxFPtQCSDQf8HKP4iBgIgVmlT6pVEgRzH1NGPSQAWKZB0CDEX5d99vYY4Q3lHDZB0xDtez9Jj5hs3S4vYC93XmwZDZD';

//app will listen to port 5000
app.listen(process.env.PORT || 5000, () => console.log('webhook is listening'));

/*Facebook Validation for the app*/
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'sync_bot') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            if (entry.messaging) {
                console.log(entry.messaging[0].message.text);
                /*call sendMessage to send message back*/
                sendMessage(entry.messaging[0]);
            } else {
                console.log(entry);
            }
        });
        res.status(200).end();
    }
});

/* send message to facebook api*/
function sendMessage(event) {
    request({
        url: 'https://graph.facebook.com/v2.11/me/messages',
        qs: { access_token: app_token },
        method: 'POST',
        json: {
            recipient: { id: event.sender.id },
            message: { text: event.message.text }
        }
    }, function (error, response) {
        if (error) console.log('Error sending message: ', error);
        else if (response.body.error) console.log('Error: ', response.body.error);
    });
}