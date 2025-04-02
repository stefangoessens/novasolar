import axios from 'axios';

// Slack API token (should be in .env in production)
const SLACK_TOKEN = 'xoxe.xoxp-1-Mi0yLTM5NTQ1OTkwMzg3NTctMzk1NzU3NDkzODcyMi04NzE5MTgzNjcwNzM2LTg3MTkxODM2NzA4MTYtNzc3ZTAzODA4NTNjNmUwODRmNjRlNTkzMjg3NTNiYzc3MjE4YWExYTYzOTFhYzc3M2M0NDRlOGZlYTA2OWUxMw';
const SLACK_CHANNEL = '#leads'; // Channel name with # prefix for public channels

// Alternative method - Incoming Webhook URL
// You should create one at https://api.slack.com/apps > Your App > Incoming Webhooks
// This is a fallback method that will be used if the postMessage API method fails
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

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
/**
 * Try to send a message using the Slack webhook as fallback
 */
const sendViaWebhook = async (formData) => {
  try {
    console.log('Trying fallback method: Sending via Slack webhook...');
    
    // Create a simpler message for the webhook
    const { serviceType, personalDetails } = formData;
    
    // Simplify service type
    const serviceTypeMapping = {
      'zonnepanelen': 'Zonnepanelen',
      'zonnepanelen-batterij': 'Zonnepanelen & Batterijopslag',
      'batterijopslag': 'Batterijopslag',
      'laadpaal': 'Laadpaal'
    };
    
    // Webhook requires different format
    const webhookPayload = {
      text: `🔔 *Nieuwe offerte aanvraag*: ${serviceTypeMapping[serviceType] || serviceType}`,
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
          text: {
            type: "mrkdwn",
            text: `*Klant:* ${personalDetails.name}\n*Email:* ${personalDetails.email}\n*Tel:* ${personalDetails.phone}\n*Adres:* ${personalDetails.address}`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Service:* ${serviceTypeMapping[serviceType] || serviceType}`
          }
        }
      ]
    };
    
    // Send to webhook
    const response = await axios.post(SLACK_WEBHOOK_URL, webhookPayload);
    
    console.log('Webhook response:', response.status);
    return { success: response.status === 200 };
  } catch (error) {
    console.error('Error sending via webhook:', error);
    return { success: false, error: error.message };
  }
};

export const sendToSlack = async (formData) => {
  try {
    console.log('Sending lead notification to Slack...');
    
    const message = formatSlackMessage(formData);
    console.log('Formatted Slack message:', JSON.stringify(message, null, 2));
    
    console.log('Making API request to Slack...');
    const response = await axios.post('https://slack.com/api/chat.postMessage', message, {
      headers: {
        'Authorization': `Bearer ${SLACK_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Slack API response:', response.data);
    
    if (!response.data.ok) {
      console.error('Slack API returned error:', response.data);
      throw new Error(`Slack API error: ${response.data.error || 'Unknown error'}`);
    }
    
    console.log('Successfully sent notification to Slack');
    return response.data;
  } catch (error) {
    console.error('Error sending to Slack via API:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Slack API Error Response:', error.response.data);
      console.error('Slack API Error Status:', error.response.status);
    } else if (error.request) {
      console.error('No response received from Slack API:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    
    // Try fallback method using webhook
    console.log('Attempting fallback method with webhook...');
    const webhookResult = await sendViaWebhook(formData);
    
    if (webhookResult.success) {
      console.log('Successfully sent via webhook fallback');
      return { success: true, via: 'webhook' };
    }
    
    // Both methods failed
    console.error('All Slack notification methods failed');
    
    // Don't throw error here - we want the form submission to continue even if Slack fails
    return { success: false, error: error.message };
  }
};

export default {
  sendToSlack
};