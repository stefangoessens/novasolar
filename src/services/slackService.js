import axios from 'axios';

// Slack API token (should be in .env in production)
const SLACK_TOKEN = 'xoxe.xoxp-1-Mi0yLTM5NTQ1OTkwMzg3NTctMzk1NzU3NDkzODcyMi04NzE5MTgzNjcwNzM2LTg3MTkxODM2NzA4MTYtNzc3ZTAzODA4NTNjNmUwODRmNjRlNTkzMjg3NTNiYzc3MjE4YWExYTYzOTFhYzc3M2M0NDRlOGZlYTA2OWUxMw';
const SLACK_CHANNEL = 'leads'; // Channel name where lead notifications will be sent

/**
 * Format form data into a structured Slack message
 * 
 * @param {Object} formData - The form data from the booking form
 * @returns {Object} - Formatted Slack message
 */
const formatSlackMessage = (formData) => {
  const { serviceType, roofType, energyConsumption, additionalOptions, personalDetails } = formData;
  
  // Map service types to human-readable names
  const serviceTypeMapping = {
    'zonnepanelen': 'Zonnepanelen',
    'zonnepanelen-batterij': 'Zonnepanelen & Batterijopslag',
    'batterijopslag': 'Batterijopslag',
    'laadpaal': 'Laadpaal'
  };
  
  // Format roof type based on service type
  let roofTypeText = '';
  if (serviceType === 'zonnepanelen' || serviceType === 'zonnepanelen-batterij') {
    roofTypeText = roofType === 1 ? 'Hellend dak' : 'Plat dak';
  } else if (serviceType === 'batterijopslag') {
    roofTypeText = roofType === 1 ? 'Heeft hybride omvormer' : 'Heeft geen hybride omvormer';
  } else if (serviceType === 'laadpaal') {
    if (roofType === 1) roofTypeText = '1-fase aansluiting';
    else if (roofType === 2) roofTypeText = '3-fase aansluiting';
    else roofTypeText = 'Weet niet welke aansluiting';
  }
  
  // Create additional options text if available
  const additionalOptionsText = Object.keys(additionalOptions || {}).length > 0 
    ? Object.entries(additionalOptions)
      .filter(([_, details]) => details.selected)
      .map(([service]) => service)
      .join(', ')
    : 'Geen extra opties geselecteerd';

  // Format the message with blocks for better Slack display
  return {
    channel: SLACK_CHANNEL,
    text: `Nieuwe offerte aanvraag: ${serviceTypeMapping[serviceType] || serviceType} - ${personalDetails.name}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🔔 Nieuwe Offerte Aanvraag",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Naam:*\n${personalDetails.name}`
          },
          {
            type: "mrkdwn",
            text: `*Telefoon:*\n${personalDetails.phone}`
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Email:*\n${personalDetails.email}`
          },
          {
            type: "mrkdwn",
            text: `*Adres:*\n${personalDetails.address}`
          }
        ]
      },
      {
        type: "divider"
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Service:*\n${serviceTypeMapping[serviceType] || serviceType}`
          },
          {
            type: "mrkdwn",
            text: `*Type:*\n${roofTypeText}`
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Verbruik:*\n${energyConsumption} kWh`
          },
          {
            type: "mrkdwn",
            text: `*Extra opties:*\n${additionalOptionsText}`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Aanvraag ontvangen op ${new Date().toLocaleString('nl-BE')}`
          }
        ]
      }
    ]
  };
};

/**
 * Send a lead notification to Slack
 * 
 * @param {Object} formData - The form data from the booking form
 * @returns {Promise} - Result of the Slack API call
 */
export const sendToSlack = async (formData) => {
  try {
    console.log('Sending lead notification to Slack...');
    
    const message = formatSlackMessage(formData);
    
    const response = await axios.post('https://slack.com/api/chat.postMessage', message, {
      headers: {
        'Authorization': `Bearer ${SLACK_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data.ok) {
      throw new Error(`Slack API error: ${response.data.error}`);
    }
    
    console.log('Successfully sent notification to Slack');
    return response.data;
  } catch (error) {
    console.error('Error sending to Slack:', error);
    // Don't throw error here - we want the form submission to continue even if Slack fails
    return { success: false, error: error.message };
  }
};

export default {
  sendToSlack
};