const axios = require('axios');

// Replace with your actual Plex token
const plexToken = process.env.PLEX_TOKEN;

// Discord Webhook URL
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

// Plex API endpoint to fetch the current sessions (watch history)
const plexApiUrl = 'https://plex.tv/api/v2/';
const historyEndpoint = `${plexApiUrl}status/sessions`;

// Send request to get the watch history
axios.get(historyEndpoint, {
  headers: {
    'X-Plex-Token': plexToken
  }
})
  .then(response => {
    // Check if there are any sessions and process them
    const sessions = response.data;

    // Loop through each active session (media being watched)
    sessions.forEach(session => {
      const media = session;
      const { title, duration, viewOffset } = media;

      // Check if the media is completed
      if (viewOffset >= duration) {
        // Media has been completed, send a Discord notification
        sendDiscordNotification(title);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching Plex watch history:', error);
  });

// Function to send a Discord notification when something is completed
function sendDiscordNotification(mediaTitle) {
  const payload = {
    content: `🎉 **Completed Watching**: ${mediaTitle}`
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
