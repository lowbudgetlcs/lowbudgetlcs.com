import axios from "axios";
//Check if ID and secret are in env file
export const getTwitchConfig = () => {
  try {
    const clientSecret = process.env.CLIENT_SECRET!;
    const clientID = process.env.CLIENT_ID!;
    return { clientID, clientSecret };
  } catch (e: any) {
    throw new Error("Missing Twitch client ID or secret.");
  }
};

// New twitch token aquirer
let twitchToken: string | undefined;
let tokenExpiration: Date | undefined;
export async function getTwitchToken(clientID: string, clientSecret: string) {
  try {
    if (!twitchToken || !tokenExpiration || new Date() >= tokenExpiration) {
      const response = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        null,
        {
          params: {
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: "client_credentials",
          },
        }
      );

      twitchToken = response.data.access_token;
      tokenExpiration = new Date();
      tokenExpiration.setSeconds(
        tokenExpiration.getSeconds() + response.data.expires_in
      );

      console.log("New token acquired:", twitchToken);
      console.log("Token expiration date:", tokenExpiration);
    }
    return twitchToken;
  } catch (err) {
    console.error("ERROR:", err);
    return;
  }
}

// Twitch Live check for lblcs. Runs every time the website is opened
export async function checkIfLive(clientID: string, accessToken: string) {
  let isLive;
  try {
    const response = await axios.get("https://api.twitch.tv/helix/streams", {
      headers: {
        "Client-ID": clientID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        user_login: "lowbudgetlcs",
      },
    });
    return response.data.data.length > 0;
  } catch (err) {
    console.error("ERROR:", err);
    throw err;
  }
}
