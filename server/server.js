const express = require("express");
const axios = require('axios');
const app = express();
const port = process.env.PORT;

app.get("/api", (req, res) => {
    res.json({})
});

app.listen(port, () => {
    console.log("Server started on port " + port)
});



const clientSecret = process.env.CLIENT_SECRET
const clientID = process.env.CLIENT_ID

let twitchToken;
let tokenExpiration;

async function getTwitchToken(clientID, clientSecret) {
    try {
        if (!twitchToken || new Date() >= tokenExpiration) {
            const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
                params: {
                    client_id: clientID,
                    client_secret: clientSecret,
                    grant_type: 'client_credentials'
                }
            });

            twitchToken = response.data.access_token;
            tokenExpiration = new Date();
            tokenExpiration.setSeconds(tokenExpiration.getSeconds() + response.data.expires_in);

            console.log('New token acquired:', twitchToken);
            console.log('Token expiration date:', tokenExpiration);
        } else {
            console.log('Using cached token:', twitchToken);
            console.log('Token expiration date:', tokenExpiration);
        }
        return twitchToken;
    } catch (err) {
        console.error('ERROR:', err)
    }
}

getTwitchToken(clientID, clientSecret);