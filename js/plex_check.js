const axios = require('axios');
const fs = require('fs');

// Load the last check timestamp from a file (or set it to a default value if it's not available)
const lastCheckFile = './last_check_timestamp.json';

// Retrieve the last check timestamp (in milliseconds)
let lastCheckTimestamp = 0;
if (fs.existsSync(lastCheckFile)) {
  const data = fs.readFileSync(lastCheckFile);
  lastCheckTimestamp = JSON.parse(data).timestamp;
} else {
  console.log('No previous check timestamp found, setting to 0.');
}

// Replace with your actual Plex token and Discord webhook URL
const plexToken = process.env.PLEX_TOKEN;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

// Plex API endpoint to fetch the watch history
const plexApiUrl = 'https://plex.tv/api/v2/';
const historyEndpoint = `${plexApiUrl}status/sessions`;

// Send request to get the watch history
axios.get(historyEndpoint, {
  headers: {
    'X-Plex-Token': plexToken
  }
})
  .then(response => {
    const sessions = response.data;

    let newItems = [];

    // Loop through each item in the watch history
    sessions.forEach(session => {
      const media = session;
      const { title, viewedAt } = media;

      // Check if the media was viewed after the last check timestamp
      if (new Date(viewedAt).getTime() > lastCheckTimestamp) {
        newItems.push(title);
      }
    });

    // If there are new items, send a Discord notification for each
    if (newItems.length > 0) {
      newItems.forEach(item => {
        sendDiscordNotification(item);
      });

      // Update the last check timestamp to the current time
      const currentTimestamp = Date.now();
      fs.writeFileSync(lastCheckFile, JSON.stringify({ timestamp: currentTimestamp }));
      console.log('Updated last check timestamp:', currentTimestamp);
    } else {
      console.log('No new items found since last check.');
    }
  })
  .catch(error => {
    console.error('Error fetching Plex watch history:', error);
  });

// Function to send a Discord notification when something is completed
function sendDiscordNotification(mediaTitle) {
  const payload = {
    content: `🎉 **New Watch History Item**: ${mediaTitle}`
  };

  // Send a POST request to Discord's Webhook URL
  axios.post(discordWebhookUrl, payload)
    .then(() => {
      console.log(`Sent Discord notification for "${mediaTitle}"`);
    })
    .catch(error => {
      console.error('Error sending Discord notification:', error);
    });
}
