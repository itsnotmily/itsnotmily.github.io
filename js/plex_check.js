const axios = require('axios');
const fs = require('fs');

// Path to the timestamp file
const lastCheckFile = 'last_check_timestamp.json';

// Initialize the last check timestamp
let lastCheckTimestamp = 0;

// Load the last check timestamp from the file, if it exists
if (fs.existsSync(lastCheckFile)) {
  const data = fs.readFileSync(lastCheckFile);
  lastCheckTimestamp = JSON.parse(data).timestamp;
  console.log('Last check timestamp loaded:', lastCheckTimestamp);
} else {
  console.log('No previous check timestamp found. Starting fresh.');
}

// Replace with your actual Plex token and Discord webhook URL
const plexToken = process.env.PLEX_TOKEN;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

// Plex API endpoint to fetch watch history
const historyEndpoint = 'https://plex.tv/api/v2/history/all';

// Send request to get the watch history
axios
  .get(historyEndpoint, {
    headers: {
      'X-Plex-Token': plexToken,
    },
  })
  .then((response) => {
    const historyItems = response.data;

    let newItems = [];

    // Loop through each item in the history
    historyItems.forEach((item) => {
      const { title, viewedAt } = item;

      // Check if the media was viewed after the last check timestamp
      if (new Date(viewedAt).getTime() > lastCheckTimestamp) {
        newItems.push(title);
      }
    });

    // If there are new items, send a Discord notification for each
    if (newItems.length > 0) {
      newItems.forEach((item) => {
        sendDiscordNotification(item);
      });

      // Update the last check timestamp to the most recent `viewedAt`
      const mostRecentViewedAt = Math.max(
        ...historyItems.map((item) => new Date(item.viewedAt).getTime())
      );
      console.log('Setting new timestamp:', mostRecentViewedAt);

      // Write the updated timestamp to the JSON file
      fs.writeFileSync(
        lastCheckFile,
        JSON.stringify({ timestamp: mostRecentViewedAt })
      );
      console.log('Updated last check timestamp file.');
    } else {
      console.log('No new items found since last check.');
    }
  })
  .catch((error) => {
    console.error('Error fetching Plex watch history:', error);
  });

// Function to send a Discord notification for a new history item
function sendDiscordNotification(mediaTitle) {
  const payload = {
    content: `🎉 **New Watch History Item**: ${mediaTitle}`,
  };

  // Send a POST request to Discord's Webhook URL
  axios
    .post(discordWebhookUrl, payload)
    .then(() => {
      console.log(`Sent Discord notification for "${mediaTitle}"`);
    })
    .catch((error) => {
      console.error('Error sending Discord notification:', error);
    });
}
