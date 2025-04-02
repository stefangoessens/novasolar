import axios from 'axios';
import { sendToSlack } from './slackService';

// Pipedrive API configuration
const PIPEDRIVE_API_TOKEN = process.env.REACT_APP_PIPEDRIVE_API_TOKEN || 'ac106d96dff4d025b11f318702c4a2c5c98e0886';
const PIPEDRIVE_API_URL = 'https://api.pipedrive.com/v1';

// Mapping of cleaningType to readable service names with descriptions
const serviceTypeMapping = {
  'zonnepanelen': {
    name: 'Zonnepanelen',
    description: 'Complete installatie van zonnepanelen'
  },
  'batterijopslag': {
    name: 'Batterijopslag',
    description: 'Opslag van uw zelf opgewekte energie'
  },
  'zonnepanelen-batterij': {
    name: 'Zonnepanelen & Batterijopslag',
    description: 'Complete oplossing voor energiebesparing'
  },
  'laadpaal': {
    name: 'Laadpaal',
    description: 'Elektrische auto thuis opladen'
  }
};

// Mapping for roof types
const roofTypeMapping = {
  1: 'Hellend dak',
  2: 'Plat dak'
};

// Mapping for battery hybrid inverter
const batteryInverterMapping = {
  1: 'Ja, heeft hybride omvormer',
  2: 'Nee, heeft geen hybride omvormer'
};

// Mapping for EV charger connection types
const chargerConnectionMapping = {
  1: '1-fase aansluiting',
  2: '3-fase aansluiting',
  3: 'Onbekend welke aansluiting'
};

// Mapping for house age
const houseAgeMapping = {
  'old': 'Ouder dan 10 jaar (gebouwd vóór 2014)',
  'new': 'Jonger dan 10 jaar (gebouwd na 2014)'
};

// Mapping for consumption levels
const consumptionMapping = {
  25: '2000-3000 kWh (Klein huishouden, 1-2 personen)',
  35: '3000-4000 kWh (Gemiddeld huishouden, 2-3 personen)',
  50: '4000-6000 kWh (Groot huishouden, 3-4 personen)',
  70: '6000+ kWh (Zeer groot huishouden, 5+ personen)'
};

// Mapping for EV charging with existing solar/battery
const evChargingWithSolarMapping = {
  1: 'Heeft al zonnepanelen',
  2: 'Heeft een thuisbatterij',
  3: 'Heeft zonnepanelen en een thuisbatterij',
  4: 'Heeft geen zonnepanelen of thuisbatterij'
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

// Pipedrive data field key for deal description
const PIPEDRIVE_DESCRIPTION_FIELD_KEY = '7d0f1de90d7783c75fd862efd9ee7b7f6eb94c18';

/**
 * Create a comprehensive description of all selections made in the form
 */
const createDetailedDescription = (bookingData) => {
  const { serviceType, roofType, numWindows, energyConsumption, additionalOptions, personalDetails } = bookingData;
  
  // Format date/time for better readability
  const formattedDate = new Date().toLocaleString('nl-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Start building the description
  let description = `## OFFERTE AANVRAAG DETAILS\n`;
  description += `Aanvraag ontvangen op: ${formattedDate}\n\n`;
  
  // Step 1: Service Type
  const serviceInfo = serviceTypeMapping[serviceType] || { name: serviceType, description: 'Onbekend type' };
  description += `## 1. TYPE INSTALLATIE\n`;
  description += `Geselecteerd: **${serviceInfo.name}**\n`;
  description += `Omschrijving: ${serviceInfo.description}\n\n`;
  
  // Step 2: Conditional based on service type
  description += `## 2. CONFIGURATIE\n`;
  if (serviceType === 'zonnepanelen' || serviceType === 'zonnepanelen-batterij') {
    description += `Daktype: **${roofTypeMapping[roofType] || 'Onbekend'}**\n\n`;
  } else if (serviceType === 'batterijopslag') {
    description += `Hybride omvormer aanwezig: **${batteryInverterMapping[roofType] || 'Onbekend'}**\n\n`;
    
    // Check if there's specific brand information saved in numWindows for battery installations
    if (roofType === 1 && numWindows >= 1 && numWindows <= 6) {
      const brands = ['SMA', 'Fronius', 'Huawei', 'Goodwe', 'SolarEdge', 'Onbekend'];
      const selectedBrand = brands[numWindows - 1] || 'Onbekend';
      description += `Merk omvormer: **${selectedBrand}**\n\n`;
    }
  } else if (serviceType === 'laadpaal') {
    description += `Stroomaansluiting: **${chargerConnectionMapping[roofType] || 'Onbekend'}**\n\n`;
  }
  
  // Step 3: House age or solar info for EV charger
  description += `## 3. WONING DETAILS\n`;
  if (serviceType === 'zonnepanelen' || serviceType === 'zonnepanelen-batterij') {
    // House age for solar installations
    if (additionalOptions && additionalOptions.house_age) {
      description += `Leeftijd woning: **${houseAgeMapping[additionalOptions.house_age] || 'Onbekend'}**\n\n`;
    }
  } else if (serviceType === 'laadpaal') {
    // Solar status for EV charger
    description += `Bestaande installatie: **${evChargingWithSolarMapping[numWindows] || 'Onbekend'}**\n\n`;
  }
  
  // Step 4: Energy consumption
  description += `## 4. ENERGIEVERBRUIK\n`;
  if (serviceType === 'batterijopslag' && roofType === 2) {
    // For battery without hybrid inverter - slider value
    description += `Jaarlijks verbruik: **${numWindows * 100} kWh**\n`;
    description += `Geschat aantal personen: ${Math.ceil(numWindows * 100 / 3500)}\n\n`;
  } else {
    // For other services - buttons or different selection method
    const consumptionValue = energyConsumption || (numWindows * 100);
    const consumptionLabel = consumptionMapping[consumptionValue/100] || `${consumptionValue} kWh`;
    description += `Jaarlijks verbruik: **${consumptionLabel}**\n\n`;
  }
  
  // Additional options/services if selected
  if (additionalOptions && Object.keys(additionalOptions).length > 0) {
    description += `## EXTRA OPTIES\n`;
    let hasOptions = false;
    
    Object.entries(additionalOptions).forEach(([option, details]) => {
      // Skip the house_age property as it's handled separately
      if (option === 'house_age') return;
      
      if (details && details.selected) {
        hasOptions = true;
        description += `- **${option}**`;
        if (details.count) {
          description += ` (Aantal: ${details.count})`;
        }
        description += `\n`;
      }
    });
    
    if (!hasOptions) {
      description += `Geen extra opties geselecteerd\n`;
    }
    description += `\n`;
  }
  
  // Contact information
  description += `## CONTACTGEGEVENS\n`;
  description += `- Naam: **${personalDetails.name}**\n`;
  description += `- Email: **${personalDetails.email}**\n`;
  description += `- Telefoon: **${personalDetails.phone}**\n`;
  description += `- Adres: **${personalDetails.address}**\n\n`;
  
  // Source information
  if (bookingData.metadata) {
    description += `## BRON\n`;
    description += `- Website formulier: ${bookingData.metadata.source || 'solar-calculator'}\n`;
    description += `- Campagne: ${bookingData.metadata.campaign || 'website_organic'}\n`;
    description += `- Datum: ${formattedDate}\n`;
  }
  
  return description;
};

// Helper function to create a deal in Pipedrive
const createDeal = async (personId, bookingData) => {
  try {
    console.log('Creating deal in Pipedrive for person:', personId);
    
    const { serviceType, personalDetails } = bookingData;
    
    // Format the deal title
    const serviceInfo = serviceTypeMapping[serviceType] || { name: serviceType, description: 'Onbekend type' };
    const dealTitle = `${serviceInfo.name} - ${personalDetails.name}`;
    
    // Create detailed description of all selections
    const detailedDescription = createDetailedDescription(bookingData);
    
    // Prepare custom fields object including the special description field
    const customFields = {
      [PIPEDRIVE_DESCRIPTION_FIELD_KEY]: detailedDescription
    };
    
    // Calculate an estimated deal value based on service type
    let estimatedValue = 0;
    if (serviceType === 'zonnepanelen') {
      estimatedValue = 6500;
    } else if (serviceType === 'batterijopslag') {
      estimatedValue = 8000;
    } else if (serviceType === 'zonnepanelen-batterij') {
      estimatedValue = 12000;
    } else if (serviceType === 'laadpaal') {
      estimatedValue = 2000;
    }
    
    // First create a basic payload without the custom fields
    // Some Pipedrive APIs reject non-standard fields in the initial creation
    const dealPayload = {
      title: dealTitle,
      person_id: personId,
      status: 'open',
      visible_to: 3, // visible to entire company
      value: estimatedValue,
      currency: 'EUR'
    };
    
    console.log('Deal payload to Pipedrive:', dealPayload);
    
    // Create the deal first with basic information
    const response = await axios.post(`${PIPEDRIVE_API_URL}/deals?api_token=${PIPEDRIVE_API_TOKEN}`, dealPayload);
    
    if (response.data.success) {
      const dealId = response.data.data.id;
      console.log('Deal created successfully in Pipedrive:', dealId);
      
      // Now update the deal with the custom field in a separate request
      // This two-step approach works better with Pipedrive's API
      try {
        console.log('Updating deal with detailed description...');
        
        // Try updating with a notes field first - might be more reliable than custom fields
        await axios.put(
          `${PIPEDRIVE_API_URL}/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`,
          { notes: detailedDescription }
        );
        console.log('Updated deal with notes field');
        
        // Also try the custom field for completeness
        await axios.put(
          `${PIPEDRIVE_API_URL}/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`,
          { [PIPEDRIVE_DESCRIPTION_FIELD_KEY]: detailedDescription }
        );
        console.log('Updated deal with custom description field');
      } catch (updateError) {
        console.error('Failed to update description fields, but deal was created successfully:', updateError);
        
        // Last resort: try to add a note to the deal
        try {
          await axios.post(
            `${PIPEDRIVE_API_URL}/notes?api_token=${PIPEDRIVE_API_TOKEN}`,
            { 
              deal_id: dealId,
              content: detailedDescription
            }
          );
          console.log('Added description as a note to the deal');
        } catch (noteError) {
          console.error('Failed to add note to deal:', noteError);
        }
      }
      
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
        
        // Use the enhanced service mapping
        const serviceInfo = serviceTypeMapping[serviceType] || { name: serviceType, description: 'Onbekend type' };
        const dealTitle = `${serviceInfo.name} - ${personalDetails.name}`;
        
        // Create detailed description even for fallback
        const detailedDescription = createDetailedDescription(bookingData);
        
        // Keep the fallback payload extremely simple
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
          
          // Try multiple approaches to save the description
          try {
            // First try with notes field
            await axios.put(
              `${PIPEDRIVE_API_URL}/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`,
              { notes: detailedDescription }
            );
            console.log('Updated deal with notes field using fallback method');
            
            // Then try with the custom field
            await axios.put(
              `${PIPEDRIVE_API_URL}/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`,
              { [PIPEDRIVE_DESCRIPTION_FIELD_KEY]: detailedDescription }
            );
            console.log('Updated deal with custom description field using fallback method');
          } catch (updateError) {
            console.error('Failed to update fields in fallback, trying note approach:', updateError);
            
            // Last resort: try to add a note
            try {
              await axios.post(
                `${PIPEDRIVE_API_URL}/notes?api_token=${PIPEDRIVE_API_TOKEN}`,
                { 
                  deal_id: dealId,
                  content: detailedDescription
                }
              );
              console.log('Added description as a note to the deal using fallback method');
            } catch (noteError) {
              console.error('All attempts to add description failed:', noteError);
            }
          }
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