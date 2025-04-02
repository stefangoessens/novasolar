import axios from 'axios';

// Slack API token (should be in .env in production)
const SLACK_TOKEN = 'xoxe.xoxp-1-Mi0yLTM5NTQ1OTkwMzg3NTctMzk1NzU3NDkzODcyMi04NzE5MTgzNjcwNzM2LTg3MTkxODM2NzA4MTYtNzc3ZTAzODA4NTNjNmUwODRmNjRlNTkzMjg3NTNiYzc3MjE4YWExYTYzOTFhYzc3M2M0NDRlOGZlYTA2OWUxMw';
const SLACK_CHANNEL = '#leads'; // Channel name with # prefix for public channels

// Slack Webhook URL for direct message delivery
// This is the primary method we'll use since it requires fewer permissions
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
 * Create formatted message for Slack webhook
 */
const createWebhookMessage = (formData) => {
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
      .filter(([_, details]) => details && details.selected)
      .map(([service]) => service)
      .join(', ')
    : 'Geen extra opties geselecteerd';
    
  // Create a more comprehensive message
  return {
    text: `🔔 Nieuwe offerte aanvraag: ${serviceTypeMapping[serviceType] || serviceType} - ${personalDetails.name}`,
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
 * Try to send a message using the Slack API as fallback
 */
const sendViaSlackAPI = async (formData) => {
  try {
    console.log('Trying fallback method: Sending via Slack API...');
    
    const message = formatSlackMessage(formData);
    
    const response = await axios.post('https://slack.com/api/chat.postMessage', message, {
      headers: {
        'Authorization': `Bearer ${SLACK_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Slack API response:', response.data);
    
    if (!response.data.ok) {
      throw new Error(`Slack API error: ${response.data.error || 'Unknown error'}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending via Slack API:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a lead notification to Slack
 */
export const sendToSlack = async (formData) => {
  try {
    console.log('Sending lead notification to Slack via webhook...');
    
    // Create webhook message
    const webhookMessage = createWebhookMessage(formData);
    console.log('Webhook message payload:', JSON.stringify(webhookMessage, null, 2));
    
    // Send via webhook (primary method)
    const response = await axios.post(SLACK_WEBHOOK_URL, webhookMessage);
    
    console.log('Webhook response status:', response.status);
    
    if (response.status !== 200) {
      throw new Error(`Webhook error: Status ${response.status}`);
    }
    
    console.log('Successfully sent notification to Slack via webhook');
    return { success: true, via: 'webhook' };
  } catch (error) {
    console.error('Error sending to Slack via webhook:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Webhook Error Response:', error.response.data);
      console.error('Webhook Error Status:', error.response.status);
    } else if (error.request) {
      console.error('No response received from webhook:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    
    // Try fallback method using Slack API
    console.log('Webhook failed. Attempting fallback with Slack API...');
    const apiResult = await sendViaSlackAPI(formData);
    
    if (apiResult.success) {
      console.log('Successfully sent via Slack API fallback');
      return { success: true, via: 'api' };
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