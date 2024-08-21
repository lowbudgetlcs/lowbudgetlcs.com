const express = require("express");
const axios = require('axios');
const cors = require('cors')
const app = express();
const port = 8080;
const clientSecret = process.env.CLIENT_SECRET
const clientID = process.env.CLIENT_ID

app.get("/api/checklive", cors(), async (req, res) => {
    try {
        const accessToken = await getTwitchToken(clientID, clientSecret);
        const isLive = await checkIfLive(clientID, accessToken);
        res.json({ isLive })
    } catch (err) {
        console.error("ERROR: " + err)
        res.status(500).json({ error: err.message });
    }
});


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
        }
        return twitchToken;
    } catch (err) {
        console.error('ERROR:', err)
        throw err;
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
        throw err;
    }

}

app.listen(port, () => {
    console.log("Server started on port " + port)
});