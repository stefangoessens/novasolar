import axios from 'axios';
import { sendToSlack } from './slackService';

// Pipedrive API configuration
const PIPEDRIVE_API_TOKEN = process.env.REACT_APP_PIPEDRIVE_API_TOKEN || 'ac106d96dff4d025b11f318702c4a2c5c98e0886';
const PIPEDRIVE_API_URL = 'https://api.pipedrive.com/v1';

// Mapping of cleaningType to readable service names
const serviceTypeMapping = {
  'zonnepanelen': 'Zonnepanelen',
  'batterijopslag': 'Batterijopslag', 
  'zonnepanelen-batterij': 'Zonnepanelen & Batterijopslag',
  'laadpaal': 'Laadpaal'
};

// Mapping for roof types
const roofTypeMapping = {
  1: 'Hellend dak',
  2: 'Plat dak'
};

// Mapping for consumption levels
const consumptionMapping = {
  25: '2000-3000 kWh',
  35: '3000-4000 kWh',
  50: '4000-6000 kWh',
  70: '6000+ kWh'
};

// Helper function to create a person in Pipedrive
const createPerson = async (personalDetails) => {
  try {
    console.log('Creating person in Pipedrive:', personalDetails);
    
    // Pipedrive doesn't accept a direct 'address' field, it needs to use specific address fields
    // or be added as a custom field or note
    const payload = {
      name: personalDetails.name,
      email: [{ value: personalDetails.email, primary: true }],
      phone: [{ value: personalDetails.phone, primary: true }],
      visible_to: 3, // visible to entire company
    };
    
    // Add address as a note
    if (personalDetails.address) {
      payload.notes = `Address: ${personalDetails.address}`;
    }
    
    console.log('Person payload to Pipedrive:', payload);
    
    const response = await axios.post(`${PIPEDRIVE_API_URL}/persons?api_token=${PIPEDRIVE_API_TOKEN}`, payload);
    
    if (response.data.success) {
      console.log('Person created successfully in Pipedrive:', response.data.data.id);
      return response.data.data.id;
    } else {
      console.error('Error response from Pipedrive API:', response.data);
      throw new Error(`Failed to create person in Pipedrive: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('Error creating person in Pipedrive:', error);
    throw error;
  }
};

// Helper function to create a deal in Pipedrive
const createDeal = async (personId, bookingData) => {
  try {
    console.log('Creating deal in Pipedrive for person:', personId);
    
    const { serviceType, roofType, energyConsumption, additionalOptions, personalDetails } = bookingData;
    
    // Format the deal title
    const serviceName = serviceTypeMapping[serviceType] || serviceType;
    const dealTitle = `${serviceName} - ${personalDetails.name}`;
    
    // Prepare deal description with all the details
    let description = `Service: ${serviceName}\n`;
    
    // Add personal details explicitly to the description in case they're needed
    description += `\nContactgegevens:\n`;
    description += `- Naam: ${personalDetails.name}\n`;
    description += `- Email: ${personalDetails.email}\n`;
    description += `- Telefoon: ${personalDetails.phone}\n`;
    description += `- Adres: ${personalDetails.address}\n\n`;
    
    // Add roof type for solar panel installations
    if (serviceType === 'zonnepanelen' || serviceType === 'zonnepanelen-batterij') {
      description += `Dak type: ${roofTypeMapping[roofType] || roofType}\n`;
    }
    
    // Add consumption mapping
    const consumptionLabel = consumptionMapping[energyConsumption/100] || `${energyConsumption} kWh`;
    description += `Jaarlijks verbruik: ${consumptionLabel}\n`;
    
    // Add additional services if any
    if (additionalOptions && Object.keys(additionalOptions).length > 0) {
      description += '\nAanvullende opties:\n';
      Object.entries(additionalOptions).forEach(([option, details]) => {
        if (details && details.selected) {
          description += `- ${option}\n`;
        }
      });
    }
    
    // Add house age if provided
    if (additionalOptions && additionalOptions.house_age) {
      description += `\nWoning leeftijd: ${additionalOptions.house_age === 'old' ? 'Ouder dan 10 jaar' : 'Jonger dan 10 jaar'}\n`;
    }
    
    // Add metadata if available
    if (bookingData.metadata) {
      description += `\nMetadata:\n`;
      description += `- Bron: ${bookingData.metadata.source || 'Website'}\n`;
      description += `- Datum: ${bookingData.metadata.submissionDate || new Date().toISOString()}\n`;
    }
    
    // Prepare the deal payload - keep it simple
    const dealPayload = {
      title: dealTitle,
      person_id: personId,
      // Avoid setting pipeline or stage IDs - let Pipedrive use its defaults
      status: 'open',
      visible_to: 3, // visible to entire company
      value: 0, // This will be updated later after assessment
      currency: 'EUR',
      description: description
    };
    
    console.log('Deal payload to Pipedrive:', dealPayload);
    
    // Create the deal
    const response = await axios.post(`${PIPEDRIVE_API_URL}/deals?api_token=${PIPEDRIVE_API_TOKEN}`, dealPayload);
    
    if (response.data.success) {
      console.log('Deal created successfully in Pipedrive:', response.data.data.id);
      return response.data.data.id;
    } else {
      console.error('Error response from Pipedrive API:', response.data);
      throw new Error(`Failed to create deal in Pipedrive: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('Error creating deal in Pipedrive:', error);
    // More detailed error logging
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
    }
    throw error;
  }
};

// Save a booking to Pipedrive
export async function saveBooking(bookingData) {
  try {
    console.log('saveBooking called with data:', bookingData);
    
    // Add timestamp to the booking
    const bookingWithTimestamp = {
      ...bookingData,
      created_at: new Date().toISOString()
    };
    
    console.log('Attempting to save to Pipedrive...');
    
    let personId = null;
    let dealId = null;
    let error = null;
    
    // First create the person
    try {
      console.log('Step 1: Creating person in Pipedrive');
      personId = await createPerson(bookingData.personalDetails);
      console.log('Person created successfully with ID:', personId);
    } catch (personError) {
      console.error("Error creating person:", personError);
      if (personError.response) {
        console.error("Person API Error:", personError.response.data);
      }
      error = personError;
      // Don't rethrow yet, attempt to continue if possible
    }
    
    // Verify we have a person ID
    if (!personId) {
      console.error("Cannot create deal without a person ID");
      throw error || new Error("Failed to create person in Pipedrive");
    }
    
    // Then create the deal linked to the person
    try {
      console.log('Step 2: Creating deal in Pipedrive for person ID:', personId);
      dealId = await createDeal(personId, bookingData);
      console.log('Deal created successfully with ID:', dealId);
    } catch (dealError) {
      console.error("Error creating deal:", dealError);
      if (dealError.response) {
        console.error("Deal API Error:", dealError.response.data);
      }
      
      // Try a second time with a simplified payload
      try {
        console.log('Attempting simplified deal creation as fallback...');
        const { serviceType, personalDetails } = bookingData;
        const serviceName = serviceTypeMapping[serviceType] || serviceType;
        const dealTitle = `${serviceName} - ${personalDetails.name}`;
        
        // Very simplified deal payload
        const simplePayload = {
          title: dealTitle,
          person_id: personId,
          visible_to: 3
        };
        
        const response = await axios.post(
          `${PIPEDRIVE_API_URL}/deals?api_token=${PIPEDRIVE_API_TOKEN}`, 
          simplePayload
        );
        
        if (response.data.success) {
          dealId = response.data.data.id;
          console.log('Simplified deal created successfully with ID:', dealId);
          
          // Now update the deal with the description
          const description = `Lead from website form\n\nContact: ${personalDetails.name}\nEmail: ${personalDetails.email}\nPhone: ${personalDetails.phone}\nAddress: ${personalDetails.address}`;
          
          await axios.put(
            `${PIPEDRIVE_API_URL}/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`,
            { description }
          );
        }
      } catch (fallbackError) {
        console.error("Fallback deal creation also failed:", fallbackError);
        error = dealError;
        // Still don't throw, return what we have
      }
    }
    
    // Send notification to Slack
    try {
      console.log('Step 3: Sending notification to Slack');
      const slackResult = await sendToSlack(bookingData);
      console.log('Slack notification result:', slackResult);
    } catch (slackError) {
      // Log error but do not fail the overall request if Slack notification fails
      console.error('Error sending to Slack (non-critical):', slackError);
      // Continue with the flow, don't throw
    }
    
    const result = {
      success: !!dealId, // Only consider it a success if we created a deal
      personId,
      dealId,
      ...bookingWithTimestamp
    };
    
    console.log('Final result of Pipedrive submission:', result);
    
    // If we got this far but failed to create a deal, throw an error
    if (!dealId) {
      throw error || new Error("Failed to create deal in Pipedrive");
    }
    
    return result;
  } catch (error) {
    console.error("Error saving to Pipedrive:", error);
    throw error;
  }
}

// Get Pipedrive deals (for admin purposes if needed)
// Utility function to get all available pipelines
export async function getPipedrivePipelines() {
  try {
    const response = await axios.get(
      `${PIPEDRIVE_API_URL}/pipelines?api_token=${PIPEDRIVE_API_TOKEN}`
    );
    
    if (response.data.success) {
      console.log('Available Pipedrive Pipelines:', response.data.data);
      return response.data.data || [];
    } else {
      console.error('Failed to fetch pipelines from Pipedrive', response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching pipelines from Pipedrive:", error);
    return [];
  }
}

// Utility function to get all available stages (for future reference)
export async function getPipedriveStages() {
  try {
    // First get the pipelines for reference
    await getPipedrivePipelines();
    
    const response = await axios.get(
      `${PIPEDRIVE_API_URL}/stages?api_token=${PIPEDRIVE_API_TOKEN}`
    );
    
    if (response.data.success) {
      console.log('Available Pipedrive Stages:', response.data.data);
      return response.data.data || [];
    } else {
      console.error('Failed to fetch stages from Pipedrive', response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching stages from Pipedrive:", error);
    return [];
  }
}

export async function getAllDeals() {
  try {
    // Note: We've removed the development environment check to always make real API calls
    
    // Real API call for production
    const response = await axios.get(
      `${PIPEDRIVE_API_URL}/deals?api_token=${PIPEDRIVE_API_TOKEN}&status=open&sort=add_time%20DESC&get_summary=1`
    );
    
    if (response.data.success) {
      return response.data.data || [];
    } else {
      throw new Error('Failed to fetch deals from Pipedrive');
    }
  } catch (error) {
    console.error("Error fetching deals from Pipedrive:", error);
    // In case of API error in production, return empty array instead of throwing
    return [];
  }
}

// Archive/delete a deal from Pipedrive
export async function deleteDeal(dealId) {
  try {
    // Call the Pipedrive API to delete a deal
    const response = await axios.delete(
      `${PIPEDRIVE_API_URL}/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`
    );
    
    if (response.data.success) {
      return true;
    } else {
      console.error("Pipedrive returned error:", response.data);
      throw new Error('Failed to delete deal from Pipedrive');
    }
  } catch (error) {
    console.error("Error deleting deal from Pipedrive:", error);
    if (error.response) {
      console.error("API response:", error.response.data);
    }
    
    // Re-throw the error so the UI can handle it
    throw error;
  }
}