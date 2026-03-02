const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shortMs = 1000;
const longMs = 120000;
const shortLimit = Number(process.env.RIOT_RATE_LIMIT_SHORT ?? 20);
const longLimit = Number(process.env.RIOT_RATE_LIMIT_LONG ?? 100);

const timestamps: number[] = [];

export const waitForRiotRateLimit = async () => {
  while (true) {
    const now = Date.now();

    while (timestamps[0] && timestamps[0] <= now - longMs) timestamps.shift();

    const cutoff = now - shortMs;
    let shortCount = 0;
    for (let i = timestamps.length - 1; i >= 0 && timestamps[i] > cutoff; i--) shortCount++;

    if (shortCount < shortLimit && timestamps.length < longLimit) {
      timestamps.push(now);
      return;
    }

    const waitShort = shortCount >= shortLimit ? timestamps[timestamps.length - shortCount] - cutoff + 5 : 0;
    const waitLong = timestamps.length >= longLimit ? timestamps[0] - (now - longMs) + 5 : 0;
    console.warn(`[Riot API] ⏱️ rate limit reached. Waiting for ${Math.max(waitShort, waitLong)} ms...`);
    await sleep(Math.max(10, waitShort, waitLong));
  }
};
