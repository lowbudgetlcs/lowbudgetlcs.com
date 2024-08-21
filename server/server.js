const express = require("express");
const axios = require('axios');
const { error } = require("console");
const app = express();
const port = process.env.PORT;

const clientSecret = process.env.CLIENT_SECRET
const clientID = process.env.CLIENT_ID

app.get("/api/checklive", async (req, res) => {
    try {
        const accessToken = await getTwitchToken(clientID, clientSecret);
        const isLive = await checkIfLive(clientID, accessToken);
        console.log(isLive)
        res.json({ isLive })
    } catch (err) {
        console.error("ERROR: " + err)
        res.json({ err })
    }
});


let twitchToken;
let tokenExpiration;

async function getTwitchToken(clientID, clientSecret) {
    console.log(clientID

    )
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
        }
        return twitchToken;
    } catch (err) {
        console.error('ERROR:', err)
    }
}

async function checkIfLive(clientID, accessToken) {
    let isLive
    try {

        const response = await axios.get('https://api.twitch.tv/helix/streams', {
            headers: {
                'Client-ID': clientID,
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                user_login: 'lowbudgetlcs'
            }
        });
        if (response.data.data.length > 0) {
            isLive = true
        } else {
            isLive = false

        }
        return isLive
    } catch (err) {
        console.error('ERROR:', err)
    }
}

app.listen(port, () => {
    console.log("Server started on port " + port)
});