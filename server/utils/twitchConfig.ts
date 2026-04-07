//Check if ID and secret are in env file
export const getTwitchConfig = () => {
const clientSecret: string | undefined = process.env.CLIENT_SECRET;
const clientID: string | undefined = process.env.CLIENT_ID;

  if (!clientID || !clientSecret) {
    throw new Error("Missing Twitch client ID or secret.");
  }

  return { clientID, clientSecret };
};

// New twitch token aquirer
let twitchToken: string | undefined;
let tokenExpiration: Date | undefined;
export async function getTwitchToken(clientID: string, clientSecret: string) {
    try {
      if (!twitchToken || !tokenExpiration || new Date() >= tokenExpiration) {
        const response = await fetch("https://id.twitch.tv/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: "client_credentials",
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to acquire Twitch token: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as {
          access_token: string;
          expires_in: number;
        };
  
        twitchToken = data.access_token;
        tokenExpiration = new Date();
        tokenExpiration.setSeconds(
          tokenExpiration.getSeconds() + data.expires_in
        );
  
        console.log("New token acquired:", twitchToken);
        console.log("Token expiration date:", tokenExpiration);
      }
      return twitchToken;
    } catch (err) {
      console.error("ERROR:", err);
      throw err;
    }
  }
  
  // Twitch Live check for lblcs. Runs every time the website is opened
 export async function checkIfLive(clientID: string, accessToken: string) {
    let isLive;
    try {
      const url = new URL("https://api.twitch.tv/helix/streams");
      url.searchParams.set("user_login", "lowbudgetlcs");

      const response = await fetch(url, {
        headers: {
          "Client-ID": clientID,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check Twitch live status: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as { data: unknown[] };

      if (data.data.length > 0) {
        isLive = true;
      } else {
        isLive = false;
      }
      return isLive;
    } catch (err) {
      console.error("ERROR:", err);
      throw err;
    }
  }