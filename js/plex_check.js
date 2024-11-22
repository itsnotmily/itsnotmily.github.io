const axios = require('axios');

// Retrieve secrets from environment variables
const plexToken = process.env.PLEX_TOKEN;  // Access the PLEX_TOKEN secret
const plexServerUrl = process.env.PLEX_SERVER_URL;  // Access the PLEX_SERVER_URL secret
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;  // Access the DISCORD_WEBHOOK_URL secret

// Fetch recently watched items from the Plex API
async function getRecentWatched() {
  try {
    const response = await axios.get(`${plexServerUrl}/status/sessions`, {
      headers: {
        'X-Plex-Token': plexToken
      }
    });

    return response.data.MediaContainer.Video || [];
  } catch (error) {
    console.error('Error fetching data from Plex:', error);
    return [];
  }
}

// Send a notification to Discord
async function sendDiscordNotification(content) {
  try {
    const message = {
      content: `🎬 New watched item on Plex: ${content}`
    };

    await axios.post(discordWebhookUrl, message);
    console.log('Discord notification sent!');
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}

// Check if there is any new watched content
async function checkNewWatched() {
  const recentWatched = await getRecentWatched();

  if (recentWatched.length > 0) {
    const latestItem = recentWatched[0];
    const contentTitle = latestItem.title;
    console.log(`New watched item: ${contentTitle}`);
    
    // Send notification to Discord
    await sendDiscordNotification(contentTitle);
  } else {
    console.log('No new watched content.');
  }
}

// Run the script
checkNewWatched();
