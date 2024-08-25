import express, {Express, Request, Response} from "express";
import axios from 'axios';
import cors from 'cors';
import { getPlayers } from "./db/queries/select";
const app = express();
const port = 8080;
const clientSecret: string | undefined = process.env.CLIENT_SECRET
const clientID: string | undefined = process.env.CLIENT_ID

// const corsOptions = {
//     origin: 'https://lowbudgetlcs.com',
//     methods: 'GET',
// };

app.use(cors())

app.get("/api/checklive", async (req: Request, res: Response) => {
    try {
        if (!clientID || !clientSecret) {
            throw new Error("Missing Twitch client ID or secret.");
        }
        const accessToken = await getTwitchToken(clientID, clientSecret);
        if (!accessToken) {
            throw new Error("Missing Access Token")
        }
        const isLive = await checkIfLive(clientID, accessToken);
        res.json({ isLive })
    } catch (err: any) {
        console.error("ERROR: " + err)
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/getPlayers", async (req: Request, res: Response) => {
    try {
      const response = await getPlayers(); 
      res.json(response)

    } catch (err:any) {
        console.error("ERROR: " + err)
        res.status(500).json({ error: err.message });
    }
})

let twitchToken: string | undefined;
let tokenExpiration:Date | undefined;

async function getTwitchToken(clientID: string, clientSecret: string) {
    try {
        if (!twitchToken ||!tokenExpiration || new Date() >= tokenExpiration) {
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

async function checkIfLive(clientID: string, accessToken: string) {
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