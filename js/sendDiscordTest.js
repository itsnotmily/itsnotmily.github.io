const axios = require('axios');

// Replace with your actual Discord webhook URL (you can store this in GitHub Secrets)
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

// Simple payload for the test notification
const payload = {
  content: 'This is a **test** notification from GitHub Actions! 🎉'
};

// Send a POST request to Discord's Webhook URL
axios.post(discordWebhookUrl, payload)
  .then(() => {
    console.log('Sent Discord notification!');
  })
  .catch(error => {
    console.error('Error sending Discord notification:', error);
  });
