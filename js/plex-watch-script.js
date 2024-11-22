const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Retrieve secrets from environment variables
const plexToken = process.env.PLEX_TOKEN;  // Access the PLEX_TOKEN secret
const plexServerUrl = process.env.PLEX_SERVER_URL;  // Access the PLEX_SERVER_URL secret
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;  // Access the DISCORD_WEBHOOK_URL secret

// Path to store the last watched item
const lastWatchedFile = path.join(__dirname, 'last_watched.json');

// Ensure that plexServerUrl ends with a slash for proper concatenation
const normalizedPlexServerUrl = plexServerUrl.endsWith('/') ? plexServerUrl : `${plexServerUrl}/`;

// Fetch recently watched items from the Plex API
async function getRecentWatched() {
  try {
    // Construct the full URL dynamically
    const url = new URL('status/sessions', normalizedPlexServerUrl);
    console.log(`Requesting Plex API: ${url.toString()}`);  // Debugging: Log the final API URL

    const response = await axios.get(url.toString(), {
      headers: {
        'X-Plex-Token': plexToken
      }
    });

    if (response.data && response.data.MediaContainer) {
      console.log('Successfully connected to Plex API and fetched data.');
      await sendDiscordNotification('Successfully connected to the Plex API and fetched watched history!');
    } else {
      console.log('No media data found.');
    }

    return response.data.MediaContainer.Video || [];
  } catch (error) {
    console.error('Error fetching data from Plex:', error);
    await sendDiscordNotification('Failed to connect to the Plex API.');
    return [];
  }
}

// Send a notification to Discord
async function sendDiscordNotification(content) {
  try {
    const message = {
      content: content
    };

    await axios.post(discordWebhookUrl, message);
    console.log('Discord notification sent!');
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}

// Load the last watched item from file (if it exists)
function loadLastWatched() {
  try {
    if (fs.existsSync(lastWatchedFile)) {
      const data = fs.readFileSync(lastWatchedFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading last watched data:', error);
  }
  return null;
}

// Save the last watched item to file
function saveLastWatched(item) {
  try {
    fs.writeFileSync(lastWatchedFile, JSON.stringify(item, null, 2));
    console.log('Last watched item saved.');
  } catch (error) {
    console.error('Error saving last watched data:', error);
  }
}

// Check if there is any new watched content
async function checkNewWatched() {
  const recentWatched = await getRecentWatched();

  if (recentWatched.length > 0) {
    const latestItem = recentWatched[0];  // Get the most recent watched item
    const latestItemId = latestItem.ratingKey;  // You can use the `ratingKey` as a unique identifier

    console.log(`Latest watched item ID: ${latestItemId}`);

    // Load the last watched item from file
    const lastWatched = loadLastWatched();

    // Check if the last watched item has changed
    if (!lastWatched || lastWatched.ratingKey !== latestItemId) {
      console.log(`New watched item detected: ${latestItem.title}`);
      
      // Send a notification to Discord
      await sendDiscordNotification(`New watched item on Plex: ${latestItem.title}`);

      // Save the new watched item as the last watched item
      saveLastWatched({
        title: latestItem.title,
        ratingKey: latestItemId
      });
    } else {
      console.log('No new watched content.');
    }
  } else {
    console.log('No recent watched content.');
  }
}

// Run the script
checkNewWatched();
