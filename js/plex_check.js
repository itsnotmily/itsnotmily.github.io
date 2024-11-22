const axios = require('axios');
const fs = require('fs');

// Replace with your Plex token
const plexToken = process.env.PLEX_TOKEN;

// Discord Webhook URL
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

// Path to JSON file storing the last check timestamp
const lastCheckFile = './last_time_checked.json';

// Function to load the last check timestamp
function loadLastCheckTimestamp() {
  if (fs.existsSync(lastCheckFile)) {
    const data = fs.readFileSync(lastCheckFile, 'utf8');
    return JSON.parse(data).lastCheck || 0;
  }
  console.log('No previous check timestamp found. Starting fresh.');
  return 0;
}

// Function to save the last check timestamp
function saveLastCheckTimestamp(timestamp) {
  fs.writeFileSync(lastCheckFile, JSON.stringify({ lastCheck: timestamp }));
}

const lastCheckTimestamp = loadLastCheckTimestamp();

// API endpoint to fetch history
const historyEndpoint = 'https://plex.tv/api/v2/user/history';

// Fetch the watch history
axios
  .get(historyEndpoint, {
    headers: {
      'X-Plex-Token': plexToken,
    },
  })
  .then((response) => {
    const historyItems = response.data;

    let newItems = [];
    historyItems.forEach((item) => {
      const { title, viewedAt } = item;
      if (new Date(viewedAt).getTime() > lastCheckTimestamp) {
        newItems.push(title);
      }
    });

    if (newItems.length > 0) {
      newItems.forEach((item) => sendDiscordNotification(item));
      const mostRecentViewedAt = Math.max(
        ...historyItems.map((item) => new Date(item.viewedAt).getTime())
      );
      saveLastCheckTimestamp(mostRecentViewedAt);
    } else {
      console.log('No new items found since last check.');
    }
  })
  .catch((error) => {
    console.error('Error fetching Plex watch history:', error.response?.status, error.response?.statusText);
  });

// Function to send a Discord notification
function sendDiscordNotification(mediaTitle) {
  const payload = {
    content: `🎉 **New Watch History Item**: ${mediaTitle}`,
  };

  axios.post(discordWebhookUrl, payload).catch((error) => {
    console.error('Error sending Discord notification:', error);
  });
}
