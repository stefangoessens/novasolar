import { supabase } from '../supabase';

const TABLE_NAME = 'settings';
const PRICING_ID = 'pricing'; // We'll use this as a unique ID for the pricing settings

// Default pricing values if not set in the database
const DEFAULT_PRICING = {
  BASE_RATE_PER_WINDOW: 5,
  TWO_STORY_SURCHARGE: 0.25, // 25%
  INSIDE_CLEANING_SURCHARGE_PER_WINDOW: 4,
  TRACK_CLEANING_RATE: 1.00,
  SCREEN_CLEANING_RATE: 1.50,
  HARD_WATER_RATE: 2.00,
  DEFAULT_WINDOW_PER_SQFT: 0.01,
  last_updated: new Date().toISOString()
};

// Fetch current pricing settings
export const getPricingSettings = async () => {
  try {
    // Get the pricing settings by ID
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', PRICING_ID)
      .single();

    if (error) {
      // If the error is 'No rows found', create default pricing
      if (error.code === 'PGRST116') {
        return createDefaultPricing();
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting pricing settings:', error);
    return DEFAULT_PRICING; // Fallback to defaults on error
  }
};

// Create default pricing settings
async function createDefaultPricing() {
  try {
    const pricingData = {
      id: PRICING_ID,
      ...DEFAULT_PRICING
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(pricingData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating default pricing settings:', error);
    return DEFAULT_PRICING; // Fallback to defaults on error
  }
}

// Update pricing settings
export const updatePricingSettings = async (newPricing) => {
  try {
    // Ensure we have the current settings to merge with
    const currentPricing = await getPricingSettings();
    
    // Merge the current pricing with the new pricing values
    const updatedPricing = {
      ...currentPricing,
      ...newPricing,
      last_updated: new Date().toISOString()
    };
    
    // Update the pricing settings
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updatedPricing)
      .eq('id', PRICING_ID)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating pricing settings:', error);
    throw error;
  }
};