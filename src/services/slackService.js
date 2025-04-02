import axios from 'axios';

// Webhook URL for Slack notification
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

/**
 * Send a lead notification to Slack using webhook
 * 
 * @param {Object} formData - The form data from the booking form
 * @returns {Promise} - Result of the Slack webhook call
 */
export const sendToSlack = async (formData) => {
  try {
    console.log('Sending simple notification to Slack webhook...');
    
    const { serviceType, personalDetails } = formData;
    
    // Map service types to readable names
    const serviceTypeMapping = {
      'zonnepanelen': 'Zonnepanelen',
      'zonnepanelen-batterij': 'Zonnepanelen & Batterijopslag',
      'batterijopslag': 'Batterijopslag',
      'laadpaal': 'Laadpaal'
    };
    
    // Create a simple text-only message
    const message = {
      text: `Nieuwe offerte aanvraag!\n\nService: ${serviceTypeMapping[serviceType] || serviceType}\nNaam: ${personalDetails.name}\nEmail: ${personalDetails.email}\nTelefoon: ${personalDetails.phone}\nAdres: ${personalDetails.address}`
    };
    
    console.log('Sending plain text message:', message);
    
    // Send to webhook URL
    const response = await axios.post(SLACK_WEBHOOK_URL, message);
    
    console.log('Webhook response status:', response.status);
    
    return { success: response.status === 200 };
  } catch (error) {
    console.error('Error sending to Slack webhook:', error);
    
    // Detailed error logging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    // Don't throw error - we want the form submission to continue
    return { success: false, error: error.message };
  }
};

export default {
  sendToSlack
};